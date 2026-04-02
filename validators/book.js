const { body } = require("express-validator");

const bookValidator = [
  body("title").notEmpty().withMessage("title is required"),
  body("price").isFloat({ min: 0 }).withMessage("price must be a non-negative number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("stock must be a non-negative integer"),
  body("author_id").optional({ nullable: true }).isInt().withMessage("author_id must be an integer"),
  body("category_id").optional({ nullable: true }).isInt().withMessage("category_id must be an integer"),
];

const uploadCoverValidator = [
  body("bookId").notEmpty().withMessage("bookId is required"),
];

module.exports = { bookValidator, uploadCoverValidator };
