const express = require("express");
const router = express.Router();
const { requireAuth } = require("../utils/auth");
const {
  listMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotificationController,
} = require("../controllers/notification");

// Middleware xác thực cho tất cả route
router.use(requireAuth);

// GET: Lấy danh sách thông báo của user
router.get("/", listMyNotifications);

// GET: Lấy số lượng thông báo chưa đọc
router.get("/unread-count", getUnreadCount);

// PUT: Đánh dấu thông báo đã đọc
router.put("/:id/read", markAsRead);

// DELETE: Xóa thông báo
router.delete("/:id", deleteNotificationController);

module.exports = router;
