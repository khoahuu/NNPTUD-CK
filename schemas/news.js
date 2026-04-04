const pool = require("../utils/db");

async function createNews({ title, summary, content, image_url, published_at }) {
  const [result] = await pool.query(
    `INSERT INTO news (title, summary, content, image_url, published_at)
     VALUES (?, ?, ?, ?, ?)`,
    [title, summary || null, content, image_url || null, published_at || new Date()]
  );
  return result.insertId;
}

async function getAllNews(limit = null, offset = 0) {
  if (limit && !Number.isInteger(limit)) limit = null;
  if (!Number.isInteger(offset)) offset = 0;

  let query = `SELECT id, title, summary, image_url, published_at
     FROM news
     WHERE published_at <= NOW()
     ORDER BY published_at DESC`;
  
  if (limit) {
    query += ` LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(query, [limit, offset]);
    return rows;
  }

  const [rows] = await pool.query(query);
  return rows;
}

async function getNewsCount() {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as total FROM news WHERE published_at <= NOW()`
  );
  return rows[0]?.total || 0;
}

async function getNewsById(id) {
  const [rows] = await pool.query(
    `SELECT id, title, summary, content, image_url, published_at
     FROM news
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function updateNewsById(id, updates) {
  const fields = [];
  const values = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.summary !== undefined) {
    fields.push("summary = ?");
    values.push(updates.summary);
  }
  if (updates.content !== undefined) {
    fields.push("content = ?");
    values.push(updates.content);
  }
  if (updates.image_url !== undefined) {
    fields.push("image_url = ?");
    values.push(updates.image_url);
  }
  if (updates.published_at !== undefined) {
    fields.push("published_at = ?");
    values.push(updates.published_at);
  }

  if (!fields.length) return false;

  values.push(id);
  const [result] = await pool.query(`UPDATE news SET ${fields.join(", ")} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

async function deleteNewsById(id) {
  const [result] = await pool.query("DELETE FROM news WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
  getNewsCount,
};
