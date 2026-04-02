function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function notFoundHandler(req, res, next) {
  next(createError(404, "Route not found"));
}

function errorHandler(err, req, res, next) {
  // MySQL foreign key constraint error
  if (err.code === "ER_ROW_IS_REFERENCED_2" || err.errno === 1451) {
    return res.status(409).json({
      success: false,
      message: "Không thể xóa vì dữ liệu này đang được sử dụng ở nơi khác.",
    });
  }
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
