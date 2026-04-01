const pool = require("../utils/db");

async function createReview({ userId, bookId, rating, comment }) {
  const [result] = await pool.query(
    "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)",
    [userId, bookId, rating, comment || null]
  );
  return result.insertId;
}

async function getReviewsByBookId(bookId) {
  const [rows] = await pool.query(
    `
      SELECT r.*, u.name AS reviewer_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.book_id = ?
      ORDER BY r.id DESC
    `,
    [bookId]
  );
  return rows;
}

async function getReviewById(id) {
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateReviewById(id, { rating, comment }) {
  const [result] = await pool.query("UPDATE reviews SET rating = ?, comment = ? WHERE id = ?", [
    rating,
    comment || null,
    id,
  ]);
  return result.affectedRows > 0;
}

async function deleteReviewById(id) {
  const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createReview,
  getReviewsByBookId,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
