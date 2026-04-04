const express = require("express");
const {
  listCoupons,
  getCoupon,
  createCouponController,
  updateCouponController,
  validateCouponController,
  applyCoupon,
  deleteCouponController,
} = require("../controllers/coupon");
const { requireAuth, requireRole } = require("../utils/auth");
const validate = require("../utils/validate");
const { couponValidator, validateCouponCodeValidator } = require("../validators/coupon");

const router = express.Router();

// Public routes
router.get("/", listCoupons);
router.get("/:id", getCoupon);
router.post("/validate/:code", validateCouponCodeValidator, validate, validateCouponController);

// Admin-only routes
router.post("/", requireAuth, requireRole("admin"), couponValidator, validate, createCouponController);
router.patch("/:id", requireAuth, requireRole("admin"), couponValidator, validate, updateCouponController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteCouponController);

// User routes
router.post("/apply", requireAuth, applyCoupon);

module.exports = router;