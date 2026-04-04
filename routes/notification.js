const express = require("express");
const router = express.Router();
const { requireAuth } = require("../utils/auth");
const {
  listMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotificationController,
} = require("../controllers/notification");

router.use(requireAuth);

router.get("/", listMyNotifications);
router.get("/unread/count", getUnreadCount);
router.patch("/read/all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotificationController);

module.exports = router;
