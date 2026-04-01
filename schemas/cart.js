const pool = require("../utils/db");

async function getOrCreateCartByUserId(userId) {
  const [existing] = await pool.query("SELECT * FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  if (existing[0]) return existing[0];

  const [result] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  const [rows] = await pool.query("SELECT * FROM carts WHERE id = ? LIMIT 1", [result.insertId]);
  return rows[0];
}

async function getCartDetailByUserId(userId) {
  const cart = await getOrCreateCartByUserId(userId);
  const [items] = await pool.query(
    `
      SELECT ci.id, ci.book_id, ci.quantity, b.title, b.price, b.image_url
      FROM cart_items ci
      JOIN books b ON b.id = ci.book_id
      WHERE ci.cart_id = ?
      ORDER BY ci.id DESC
    `,
    [cart.id]
  );

  return { cart, items };
}

async function addOrUpdateCartItem(userId, bookId, quantity) {
  const cart = await getOrCreateCartByUserId(userId);
  const [rows] = await pool.query(
    "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND book_id = ? LIMIT 1",
    [cart.id, bookId]
  );

  if (rows[0]) {
    await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [rows[0].quantity + quantity, rows[0].id]);
    return rows[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO cart_items (cart_id, book_id, quantity) VALUES (?, ?, ?)",
    [cart.id, bookId, quantity]
  );
  return result.insertId;
}

async function updateCartItemQuantity(userId, itemId, quantity) {
  const cart = await getOrCreateCartByUserId(userId);
  const [result] = await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?", [
    quantity,
    itemId,
    cart.id,
  ]);
  return result.affectedRows > 0;
}

async function deleteCartItem(userId, itemId) {
  const cart = await getOrCreateCartByUserId(userId);
  const [result] = await pool.query("DELETE FROM cart_items WHERE id = ? AND cart_id = ?", [itemId, cart.id]);
  return result.affectedRows > 0;
}

async function clearCart(cartId) {
  await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
}

module.exports = {
  getCartDetailByUserId,
  addOrUpdateCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
  getOrCreateCartByUserId,
};
