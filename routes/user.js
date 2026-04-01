const express = require("express");
const {
  listUsers,
  getUserById,
  getMyProfile,
  updateUser,
  updateMyProfile,
  removeUser,
} = require("../controllers/user");
const { requireAuth, requireRole } = require("../utils/auth");

const router = express.Router();

router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, updateMyProfile);

router.get("/", requireAuth, requireRole("admin"), listUsers);
router.get("/:id", requireAuth, requireRole("admin"), getUserById);
router.patch("/:id", requireAuth, requireRole("admin"), updateUser);
router.delete("/:id", requireAuth, requireRole("admin"), removeUser);

module.exports = router;
