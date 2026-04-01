const express = require("express");
const {
  listCategories,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category");
const { requireAuth, requireRole } = require("../utils/auth");

const router = express.Router();

router.get("/", listCategories);
router.post("/", requireAuth, requireRole("admin"), createCategoryController);
router.patch("/:id", requireAuth, requireRole("admin"), updateCategoryController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteCategoryController);

module.exports = router;
