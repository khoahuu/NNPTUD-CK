const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  getAllUsers,
  findUserById,
  updateUserById,
  deleteUserById,
} = require("../schemas/user");

const listUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await findUserById(req.params.id);
  if (!user) return next(createError(404, "User not found"));
  res.json({ success: true, data: user });
});

const getMyProfile = asyncHandler(async (req, res, next) => {
  const user = await findUserById(req.user.id);
  if (!user) return next(createError(404, "User not found"));
  res.json({ success: true, data: user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const ok = await updateUserById(req.params.id, payload);
  if (!ok) return next(createError(404, "User not found or no changes"));
  const user = await findUserById(req.params.id);
  res.json({ success: true, data: user });
});

const updateMyProfile = asyncHandler(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
  };
  const ok = await updateUserById(req.user.id, payload);
  if (!ok) return next(createError(400, "No changes"));
  const user = await findUserById(req.user.id);
  res.json({ success: true, data: user });
});

const removeUser = asyncHandler(async (req, res, next) => {
  const ok = await deleteUserById(req.params.id);
  if (!ok) return next(createError(404, "User not found"));
  res.json({ success: true, message: "User deleted" });
});

module.exports = {
  listUsers,
  getUserById,
  getMyProfile,
  updateUser,
  updateMyProfile,
  removeUser,
};
