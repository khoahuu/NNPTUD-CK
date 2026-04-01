const pool = require("../utils/db");

async function createOrderWithItems({ userId, shippingAddress, items }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += Number(item.price) * Number(item.quantity);
    }

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)",
      [userId, totalAmount, shippingAddress]
    );

    const orderId = orderResult.insertId;
    for (const item of items) {
      await connection.query(
        "INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [orderId, item.book_id, item.quantity, item.price]
      );
      await connection.query("UPDATE books SET stock = stock - ? WHERE id = ?", [item.quantity, item.book_id]);
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getOrdersByUserId(userId) {
  const [orders] = await pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [userId]);
  return orders;
}

async function getAllOrders() {
  const [orders] = await pool.query(
    `
      SELECT o.*, u.name AS customer_name, u.email AS customer_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.id DESC
    `
  );
  return orders;
}

async function getOrderById(orderId) {
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [orderId]);
  return rows[0] || null;
}

async function getOrderItems(orderId) {
  const [rows] = await pool.query(
    `
      SELECT oi.*, b.title
      FROM order_items oi
      JOIN books b ON b.id = oi.book_id
      WHERE oi.order_id = ?
      ORDER BY oi.id DESC
    `,
    [orderId]
  );
  return rows;
}

async function updateOrderStatus(orderId, status) {
  const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
  return result.affectedRows > 0;
}

module.exports = {
  createOrderWithItems,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
};
