const express = require("express");
const {
  listCategories,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category");
const { requireAuth, requireRole } = require("../utils/auth");
const validate = require("../utils/validate");
const { categoryValidator } = require("../validators/index");

const router = express.Router();

router.get("/", listCategories);
router.post("/", requireAuth, requireRole("admin"), categoryValidator, validate, createCategoryController);
router.patch("/:id", requireAuth, requireRole("admin"), categoryValidator, validate, updateCategoryController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteCategoryController);

module.exports = router;
