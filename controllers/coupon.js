const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  createCoupon,
  getCoupons,
  getCouponById,
  getCouponByCode,
  validateCoupon,
  updateCouponById,
  incrementCouponUsage,
  deleteCouponById,
} = require("../schemas/coupon");

const listCoupons = asyncHandler(async (req, res) => {
  console.log("GET /coupons called");
  const coupons = await getCoupons();
  console.log("Returning", coupons.length, "coupons");
  res.json({ success: true, data: coupons });
});

const getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await getCouponById(req.params.id);
  if (!coupon) return next(createError(404, "Coupon not found"));
  res.json({ success: true, data: coupon });
});

const createCouponController = asyncHandler(async (req, res, next) => {
  const {
    code,
    discount_type,
    discount_value,
    min_purchase,
    max_uses,
    expiry_date,
    is_active,
    description,
  } = req.body;

  console.log("Creating coupon with data:", {
    code,
    discount_type,
    discount_value,
    min_purchase,
    max_uses,
    expiry_date,
    is_active,
    description,
  });

  const id = await createCoupon({
    code,
    discount_type,
    discount_value,
    min_purchase,
    max_uses,
    expiry_date,
    is_active,
    description,
  });

  const coupon = await getCouponById(id);
  res.status(201).json({ success: true, data: coupon });
});

const updateCouponController = asyncHandler(async (req, res, next) => {
  const {
    code,
    discount_type,
    discount_value,
    min_purchase,
    max_uses,
    expiry_date,
    is_active,
    description,
  } = req.body;

  const ok = await updateCouponById(req.params.id, {
    code,
    discount_type,
    discount_value,
    min_purchase,
    max_uses,
    expiry_date,
    is_active,
    description,
  });

  if (!ok) return next(createError(404, "Coupon not found"));

  const coupon = await getCouponById(req.params.id);
  res.json({ success: true, data: coupon });
});

const validateCouponController = asyncHandler(async (req, res, next) => {
  const { code } = req.params;
  const { totalPrice } = req.body;

  if (!code) return next(createError(400, "Coupon code is required"));
  if (totalPrice === undefined)
    return next(createError(400, "Total price is required"));

  const result = await validateCoupon(code, totalPrice);

  if (result.valid) {
    res.json({
      success: true,
      data: {
        valid: true,
        discountAmount: result.discountAmount,
      },
    });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponId, totalPrice } = req.body;

  if (!couponId) return next(createError(400, "Coupon ID is required"));
  if (!totalPrice) return next(createError(400, "Total price is required"));

  const coupon = await getCouponById(couponId);
  if (!coupon) return next(createError(404, "Coupon not found"));

  await incrementCouponUsage(couponId);

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discount_type === "percentage") {
    discountAmount = Math.floor((totalPrice * coupon.discount_value) / 100);
  } else if (coupon.discount_type === "fixed") {
    discountAmount = coupon.discount_value;
  }

  res.json({
    success: true,
    data: {
      couponId: couponId,
      code: coupon.code,
      discountAmount: discountAmount,
    },
  });
});

const deleteCouponController = asyncHandler(async (req, res, next) => {
  const ok = await deleteCouponById(req.params.id);
  if (!ok) return next(createError(404, "Coupon not found"));
  res.json({ success: true, message: "Coupon deleted" });
});

module.exports = {
  listCoupons,
  getCoupon,
  createCouponController,
  updateCouponController,
  validateCouponController,
  applyCoupon,
  deleteCouponController,
};