const { body } = require("express-validator");

const couponValidator = [
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .trim()
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage("Code must contain only alphanumeric characters, hyphens, and underscores"),
  body("discount_type")
    .notEmpty()
    .withMessage("Discount type is required")
    .trim()
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be 'percentage' or 'fixed'"),
  body("discount_value")
    .notEmpty()
    .withMessage("Discount value is required")
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a non-negative number"),
  body("min_purchase")
    .optional({ checkFalsy: true })
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Minimum purchase must be a non-negative number"),
  body("max_uses")
    .optional({ checkFalsy: true })
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Max uses must be a positive integer"),
  body("expiry_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Expiry date must be a valid ISO 8601 date"),
  body("is_active")
    .optional({ checkFalsy: true })
    .toBoolean()
    .isBoolean()
    .withMessage("is_active must be true or false"),
];

const validateCouponCodeValidator = [
  body("totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a non-negative number"),
];

module.exports = { couponValidator, validateCouponCodeValidator };