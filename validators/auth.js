const { body } = require("express-validator");

const registerValidator = [
  body("name").notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
];

const loginValidator = [
  body("email").isEmail().withMessage("valid email is required"),
  body("password").notEmpty().withMessage("password is required"),
];

const updateProfileValidator = [
  body("name").optional().notEmpty().withMessage("name cannot be empty"),
  body("email").optional().isEmail().withMessage("valid email is required"),
];

module.exports = { registerValidator, loginValidator, updateProfileValidator };
