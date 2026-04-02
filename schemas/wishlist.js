const pool = require("../utils/db");

async function getWishlistByUserId(userId) {
  const [items] = await pool.query(
    `
      SELECT w.id, w.book_id, w.created_at, b.title, b.price, b.image_url, a.name AS author
      FROM wishlists w
      JOIN books b ON b.id = w.book_id
      LEFT JOIN authors a ON a.id = b.author_id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
    `,
    [userId]
  );
  return items;
}

async function addWishlist(userId, bookId) {
  // IGNORE duplicate entries naturally because of UNIQUE KEY, but we can check if it exists or use INSERT IGNORE
  const [result] = await pool.query(
    "INSERT IGNORE INTO wishlists (user_id, book_id) VALUES (?, ?)",
    [userId, bookId]
  );
  return result.insertId || null;
}

async function removeWishlist(userId, bookId) {
  const [result] = await pool.query(
    "DELETE FROM wishlists WHERE user_id = ? AND book_id = ?",
    [userId, bookId]
  );
  return result.affectedRows > 0;
}

async function checkInWishlist(userId, bookId) {
  const [rows] = await pool.query(
    "SELECT id FROM wishlists WHERE user_id = ? AND book_id = ? LIMIT 1",
    [userId, bookId]
  );
  return !!rows[0];
}

module.exports = {
  getWishlistByUserId,
  addWishlist,
  removeWishlist,
  checkInWishlist,
};
