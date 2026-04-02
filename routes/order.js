const express = require("express");
const {
  createOrder,
  listMyOrders,
  listOrders,
  changeOrderStatus,
} = require("../controllers/order");
const { requireAuth, requireRole } = require("../utils/auth");
const validate = require("../utils/validate");
const { shippingAddressValidator, orderStatusValidator } = require("../validators/index");

const router = express.Router();

router.post("/", requireAuth, shippingAddressValidator, validate, createOrder);
router.get("/my-orders", requireAuth, listMyOrders);
router.get("/", requireAuth, requireRole("admin"), listOrders);
router.patch("/:id/status", requireAuth, requireRole("admin"), orderStatusValidator, validate, changeOrderStatus);

module.exports = router;
