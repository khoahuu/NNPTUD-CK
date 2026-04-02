const pool = require("../utils/db");

async function createBook(payload) {
  const [result] = await pool.query(
    `INSERT INTO books (title, author_id, price, stock, category_id, image_url, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [payload.title, payload.author_id || null, payload.price, payload.stock || 0,
     payload.category_id || null, payload.image_url || null, payload.description || null]
  );
  return result.insertId;
}

async function getBooks() {
  const [rows] = await pool.query(
    `SELECT b.*, a.name AS author_name, c.name AS category_name,
            ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
            COUNT(r.id) AS review_count
     FROM books b
     LEFT JOIN authors a ON b.author_id = a.id
     LEFT JOIN categories c ON b.category_id = c.id
     LEFT JOIN reviews r ON r.book_id = b.id
     WHERE b.deleted_at IS NULL
     GROUP BY b.id
     ORDER BY b.id DESC`
  );
  return rows;
}

async function getBookById(id) {
  const [rows] = await pool.query(
    `SELECT b.*, a.name AS author_name, c.name AS category_name,
            ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
            COUNT(r.id) AS review_count
     FROM books b
     LEFT JOIN authors a ON b.author_id = a.id
     LEFT JOIN categories c ON b.category_id = c.id
     LEFT JOIN reviews r ON r.book_id = b.id
     WHERE b.id = ? AND b.deleted_at IS NULL
     GROUP BY b.id LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function updateBookById(id, payload) {
  const [result] = await pool.query(
    `UPDATE books SET title = ?, author_id = ?, price = ?, stock = ?, category_id = ?, image_url = ?, description = ?
     WHERE id = ?`,
    [payload.title, payload.author_id || null, payload.price, payload.stock || 0,
     payload.category_id || null, payload.image_url || null, payload.description || null, id]
  );
  return result.affectedRows > 0;
}

async function updateBookImage(id, imageUrl) {
  const [result] = await pool.query("UPDATE books SET image_url = ? WHERE id = ?", [imageUrl, id]);
  return result.affectedRows > 0;
}

async function deleteBookById(id) {
  const [result] = await pool.query(
    "UPDATE books SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { createBook, getBooks, getBookById, updateBookById, updateBookImage, deleteBookById };
