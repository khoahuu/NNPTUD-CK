const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
} = require("../schemas/news");

const listNews = asyncHandler(async (req, res) => {
  const news = await getAllNews();
  res.json({ success: true, data: news });
});

const getNews = asyncHandler(async (req, res, next) => {
  const news = await getNewsById(req.params.id);
  if (!news) return next(createError(404, "News not found"));
  res.json({ success: true, data: news });
});

const createNewsController = asyncHandler(async (req, res) => {
  const { title, summary, content, image_url, published_at } = req.body;
  const id = await createNews({ title, summary, content, image_url, published_at });
  const created = await getNewsById(id);
  res.status(201).json({ success: true, data: created });
});

const updateNewsController = asyncHandler(async (req, res, next) => {
  const ok = await updateNewsById(req.params.id, req.body);
  if (!ok) return next(createError(404, "News not found or nothing to update"));
  const updated = await getNewsById(req.params.id);
  res.json({ success: true, data: updated });
});

const deleteNewsController = asyncHandler(async (req, res, next) => {
  const ok = await deleteNewsById(req.params.id);
  if (!ok) return next(createError(404, "News not found"));
  res.json({ success: true, data: {} });
});

module.exports = {
  listNews,
  getNews,
  createNewsController,
  updateNewsController,
  deleteNewsController,
};
