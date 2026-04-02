const pool = require("../utils/db");

async function createAuthor({ name, bio }) {
  const [result] = await pool.query("INSERT INTO authors (name, bio) VALUES (?, ?)", [name, bio || null]);
  return result.insertId;
}

async function getAuthors() {
  const [rows] = await pool.query("SELECT * FROM authors ORDER BY id DESC");
  return rows;
}

async function getAuthorById(id) {
  const [rows] = await pool.query("SELECT * FROM authors WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateAuthorById(id, { name, bio }) {
  const [result] = await pool.query("UPDATE authors SET name = ?, bio = ? WHERE id = ?", [name, bio || null, id]);
  return result.affectedRows > 0;
}

async function deleteAuthorById(id) {
  const [result] = await pool.query("DELETE FROM authors WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { createAuthor, getAuthors, getAuthorById, updateAuthorById, deleteAuthorById };
