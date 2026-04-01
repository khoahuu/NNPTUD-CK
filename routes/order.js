const express = require("express");
const {
  createOrder,
  listMyOrders,
  listOrders,
  changeOrderStatus,
} = require("../controllers/order");
const { requireAuth, requireRole } = require("../utils/auth");

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/my-orders", requireAuth, listMyOrders);
router.get("/", requireAuth, requireRole("admin"), listOrders);
router.patch("/:id/status", requireAuth, requireRole("admin"), changeOrderStatus);

module.exports = router;
