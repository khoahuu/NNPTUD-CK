const { createNotification } = require("../schemas/notification");
const pool = require("../utils/db");

async function sendOrderNotification(userId, orderId) {
  try {
    await createNotification({
      recipientId: userId,
      type: "order_created",
      title: "Đơn hàng mới",
      content: `Đơn hàng #${orderId} của bạn đã được tạo thành công.`,
      relatedObjectType: "order",
      relatedObjectId: orderId,
    });
  } catch (error) {
    console.error("Error creating order notification for user:", error);
  }
}

async function notifyAdminNewOrder(orderId, customerName) {
  try {
    // Lấy danh sách admin từ database
    const [admins] = await pool.query(
      `SELECT id FROM users WHERE role = 'admin'`
    );

    // Gửi notification tới tất cả admin
    for (const admin of admins) {
      await createNotification({
        recipientId: admin.id,
        type: "new_order",
        title: "Đơn hàng mới từ khách hàng",
        content: `${customerName} vừa đặt đơn hàng #${orderId}.`,
        relatedObjectType: "order",
        relatedObjectId: orderId,
      });
    }
  } catch (error) {
    console.error("Error creating admin notification for new order:", error);
  }
}

async function sendOrderStatusNotification(userId, orderId, newStatus) {
  try {
    const statusMessages = {
      pending: "Đơn hàng đang chờ xử lý",
      processing: "Đơn hàng đang được xử lý",
      shipped: "Đơn hàng đã được gửi đi",
      delivered: "Đơn hàng đã được giao",
      cancelled: "Đơn hàng đã bị hủy",
    };

    const message = statusMessages[newStatus] || `Trạng thái: ${newStatus}`;

    await createNotification({
      recipientId: userId,
      type: "order_status_updated",
      title: "Cập nhật trạng thái đơn hàng",
      content: `Đơn hàng #${orderId} - ${message}`,
      relatedObjectType: "order",
      relatedObjectId: orderId,
    });
  } catch (error) {
    console.error("Error creating order status notification:", error);
  }
}

async function sendReviewNotification(userId, bookId, bookTitle) {
  try {
    await createNotification({
      recipientId: userId,
      type: "review_created",
      title: "Đánh giá được tạo",
      content: `Bạn đã đánh giá sách "${bookTitle}" thành công.`,
      relatedObjectType: "book",
      relatedObjectId: bookId,
    });
  } catch (error) {
    console.error("Error creating review notification:", error);
  }
}

module.exports = {
  sendOrderNotification,
  notifyAdminNewOrder,
  sendOrderStatusNotification,
  sendReviewNotification,
};
