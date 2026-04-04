function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function notFoundHandler(req, res, next) {
  next(createError(404, "Route not found"));
}

function errorHandler(err, req, res, next) {
  console.error("Server Error:", {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
  });

  // MySQL foreign key constraint error
  if (err.code === "ER_ROW_IS_REFERENCED_2" || err.errno === 1451) {
    return res.status(409).json({
      success: false,
      message: "Không thể xóa vì dữ liệu này đang được sử dụng ở nơi khác.",
    });
  }

  // MySQL duplicate entry error
  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    return res.status(409).json({
      success: false,
      message: "Mã giảm giá đã tồn tại.",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    message: message,
  });
}

module.exports = {
  createError,
  notFoundHandler,
  errorHandler,
};
