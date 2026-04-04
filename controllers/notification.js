const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  getNotificationById,
  deleteNotification,
} = require("../schemas/notification");

const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotificationsByUserId(req.user.id);
  res.json({ success: true, data: notifications });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await getUnreadNotificationsCount(req.user.id);
  res.json({ success: true, data: { unread_count: count } });
});

const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await getNotificationById(req.params.id);
  if (!notification) {
    return next(createError(404, "Notification not found"));
  }

  // Kiểm tra quyền (notification phải thuộc về user)
  if (Number(notification.user_id) !== Number(req.user.id)) {
    return next(createError(403, "Forbidden"));
  }

  await markNotificationAsRead(req.params.id);
  const updated = await getNotificationById(req.params.id);
  res.json({ success: true, data: updated });
});

const deleteNotificationController = asyncHandler(async (req, res, next) => {
  const notification = await getNotificationById(req.params.id);
  if (!notification) {
    return next(createError(404, "Notification not found"));
  }

  // Kiểm tra quyền (notification phải thuộc về user)
  if (Number(notification.user_id) !== Number(req.user.id)) {
    return next(createError(403, "Forbidden"));
  }

  await deleteNotification(req.params.id);
  res.json({ success: true, message: "Notification deleted" });
});

module.exports = {
  listMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotificationController,
};
