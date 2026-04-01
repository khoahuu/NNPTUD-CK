const pool = require("../utils/db");

async function createUser({ name, email, passwordHash, role = "user" }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function getAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id DESC"
  );
  return rows;
}

async function updateUserById(id, updates) {
  const fields = [];
  const values = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push("email = ?");
    values.push(updates.email);
  }
  if (updates.role !== undefined) {
    fields.push("role = ?");
    values.push(updates.role);
  }

  if (!fields.length) return false;
  values.push(id);
  const [result] = await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  return result.affectedRows > 0;
}

async function deleteUserById(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
