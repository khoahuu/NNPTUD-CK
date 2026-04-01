const pool = require("../utils/db");

async function createCategory({ name, description }) {
  const [result] = await pool.query("INSERT INTO categories (name, description) VALUES (?, ?)", [
    name,
    description || null,
  ]);
  return result.insertId;
}

async function getCategories() {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateCategoryById(id, { name, description }) {
  const [result] = await pool.query("UPDATE categories SET name = ?, description = ? WHERE id = ?", [
    name,
    description || null,
    id,
  ]);
  return result.affectedRows > 0;
}

async function deleteCategoryById(id) {
  const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
