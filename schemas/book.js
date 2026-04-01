const pool = require("../utils/db");

async function createBook(payload) {
  const [result] = await pool.query(
    `
      INSERT INTO books (title, author, price, stock, category_id, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.title,
      payload.author,
      payload.price,
      payload.stock || 0,
      payload.category_id || null,
      payload.image_url || null,
      payload.description || null,
    ]
  );
  return result.insertId;
}

async function getBooks() {
  const [rows] = await pool.query(
    `
      SELECT b.*, c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.id DESC
    `
  );
  return rows;
}

async function getBookById(id) {
  const [rows] = await pool.query(
    `
      SELECT b.*, c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function updateBookById(id, payload) {
  const [result] = await pool.query(
    `
      UPDATE books
      SET title = ?, author = ?, price = ?, stock = ?, category_id = ?, image_url = ?, description = ?
      WHERE id = ?
    `,
    [
      payload.title,
      payload.author,
      payload.price,
      payload.stock || 0,
      payload.category_id || null,
      payload.image_url || null,
      payload.description || null,
      id,
    ]
  );
  return result.affectedRows > 0;
}

async function updateBookImage(id, imageUrl) {
  const [result] = await pool.query("UPDATE books SET image_url = ? WHERE id = ?", [imageUrl, id]);
  return result.affectedRows > 0;
}

async function deleteBookById(id) {
  const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  updateBookImage,
  deleteBookById,
};
