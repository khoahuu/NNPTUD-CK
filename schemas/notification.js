const pool = require("../utils/db");

async function createNotification({
  recipientId,
  type,
  title,
  content,
  relatedObjectType,
  relatedObjectId,
}) {
  const [result] = await pool.query(
    `INSERT INTO notifications 
    (user_id, type, title, content, related_object_type, related_object_id, is_read) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [recipientId, type, title, content, relatedObjectType, relatedObjectId, false]
  );
  return result.insertId;
}

async function getNotificationsByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function getUnreadNotificationsCount(userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM notifications 
    WHERE user_id = ? AND is_read = false`,
    [userId]
  );
  return rows[0].count;
}

async function markNotificationAsRead(notificationId) {
  const [result] = await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = ?`,
    [notificationId]
  );
  return result.affectedRows > 0;
}

async function getNotificationById(notificationId) {
  const [rows] = await pool.query(
    `SELECT * FROM notifications WHERE id = ? LIMIT 1`,
    [notificationId]
  );
  return rows[0] || null;
}

async function markAllNotificationsAsRead(userId) {
  const [result] = await pool.query(
    `UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false`,
    [userId]
  );
  return result.affectedRows;
}

async function deleteNotification(notificationId) {
  const [result] = await pool.query(
    `DELETE FROM notifications WHERE id = ?`,
    [notificationId]
  );
  return result.affectedRows > 0;
}

module.exports = {
  createNotification,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  getNotificationById,
  deleteNotification,
  markAllNotificationsAsRead,
};
