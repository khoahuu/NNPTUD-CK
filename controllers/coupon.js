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
  const coupons = await getCoupons();
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
        couponId: result.coupon.id,
        originalPrice: totalPrice,
        discountAmount: result.discountAmount,
        finalPrice: result.finalPrice,
        discountType: result.coupon.discount_type,
        discountValue: result.coupon.discount_value,
      },
    });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponId } = req.body;

  if (!couponId) return next(createError(400, "Coupon ID is required"));

  const coupon = await getCouponById(couponId);
  if (!coupon) return next(createError(404, "Coupon not found"));

  await incrementCouponUsage(couponId);

  res.json({
    success: true,
    message: "Coupon applied successfully",
    data: coupon,
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
