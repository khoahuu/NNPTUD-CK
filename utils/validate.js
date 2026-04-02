const { validationResult } = require("express-validator");
const { createError } = require("./error");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(400, errors.array()[0].msg));
  }
  next();
};

module.exports = validate;
