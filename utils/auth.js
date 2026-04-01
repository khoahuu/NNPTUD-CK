const { verifyToken } = require("./jwt");
const { createError } = require("./error");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(createError(401, "Invalid or expired token"));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Forbidden"));
    }
    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
