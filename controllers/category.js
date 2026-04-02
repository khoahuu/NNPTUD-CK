const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../schemas/category");

const listCategories = asyncHandler(async (req, res) => {
  const rows = await getCategories();
  res.json({ success: true, data: rows });
});

const createCategoryController = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const id = await createCategory({ name, description });
  const category = await getCategoryById(id);
  res.status(201).json({ success: true, data: category });
});

const updateCategoryController = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const ok = await updateCategoryById(req.params.id, { name, description });
  if (!ok) return next(createError(404, "Category not found"));
  const category = await getCategoryById(req.params.id);
  res.json({ success: true, data: category });
});

const deleteCategoryController = asyncHandler(async (req, res, next) => {
  const ok = await deleteCategoryById(req.params.id);
  if (!ok) return next(createError(404, "Category not found"));
  res.json({ success: true, message: "Category deleted" });
});

module.exports = {
  listCategories,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
