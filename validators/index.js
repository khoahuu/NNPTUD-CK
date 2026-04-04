const { body } = require("express-validator");

const authorValidator = [
  body("name").notEmpty().withMessage("name is required"),
];

const categoryValidator = [
  body("name").notEmpty().withMessage("name is required"),
];

const orderStatusValidator = [
  body("status")
    .isIn(["pending", "confirmed", "shipping", "completed", "cancelled"])
    .withMessage("Invalid order status"),
];

const shippingAddressValidator = [
  body("shipping_address").notEmpty().withMessage("shipping_address is required"),
];

const newsValidator = [
  body("title").notEmpty().withMessage("title is required"),
  body("content").notEmpty().withMessage("content is required"),
  body("summary").optional().isString(),
  body("image_url").optional().isURL().withMessage("image_url must be a valid URL"),
  body("published_at").optional().isISO8601().withMessage("published_at must be a valid date"),
];

const newsUpdateValidator = [
  body("title").optional().notEmpty().withMessage("title cannot be empty"),
  body("content").optional().notEmpty().withMessage("content cannot be empty"),
  body("summary").optional().isString(),
  body("image_url").optional().isURL().withMessage("image_url must be a valid URL"),
  body("published_at").optional().isISO8601().withMessage("published_at must be a valid date"),
];

const reviewValidator = [
  body("book_id").notEmpty().withMessage("book_id is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be between 1 and 5"),
];

const updateReviewValidator = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be between 1 and 5"),
];

const cartItemValidator = [
  body("book_id").notEmpty().withMessage("book_id is required"),
  body("quantity").isInt({ min: 1 }).withMessage("quantity must be greater than 0"),
];

const updateCartItemValidator = [
  body("quantity").isInt({ min: 1 }).withMessage("quantity must be greater than 0"),
];

const wishlistValidator = [
  body("bookId").notEmpty().isInt({ min: 1 }).withMessage("bookId is required"),
];

const userUpdateValidator = [
  body("name").optional().notEmpty().withMessage("name cannot be empty"),
  body("email").optional().isEmail().withMessage("valid email is required"),
  body("role").optional().isIn(["user", "admin"]).withMessage("role must be user or admin"),
];

module.exports = {
  authorValidator,
  categoryValidator,
  orderStatusValidator,
  shippingAddressValidator,
  newsValidator,
  newsUpdateValidator,
  reviewValidator,
  updateReviewValidator,
  cartItemValidator,
  updateCartItemValidator,
  wishlistValidator,
  userUpdateValidator,
};
