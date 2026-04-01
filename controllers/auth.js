const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const { createUser, findUserByEmail, findUserById } = require("../schemas/user");

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return next(createError(400, "name, email, password are required"));
  }

  const existed = await findUserByEmail(email);
  if (existed) {
    return next(createError(409, "Email already exists"));
  }

  const passwordHash = await hashPassword(password);
  const userId = await createUser({ name, email, passwordHash, role: role === "admin" ? "admin" : "user" });
  const user = await findUserById(userId);

  res.status(201).json({ success: true, data: user });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createError(400, "email and password are required"));
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return next(createError(401, "Invalid credentials"));
  }

  const matched = await comparePassword(password, user.password_hash);
  if (!matched) {
    return next(createError(401, "Invalid credentials"));
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

module.exports = {
  register,
  login,
};
