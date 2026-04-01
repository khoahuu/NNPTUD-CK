function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function notFoundHandler(req, res, next) {
  next(createError(404, "Route not found"));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

module.exports = {
  createError,
  notFoundHandler,
  errorHandler,
};
