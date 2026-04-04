const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  createNews,
  getAllNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
  getNewsCount,
} = require("../schemas/news");

const listNews = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  
  const news = await getAllNews(limit, offset);
  const total = await getNewsCount();
  
  res.json({ success: true, data: news, total });
});

const getNews = asyncHandler(async (req, res, next) => {
  const news = await getNewsById(req.params.id);
  if (!news) return next(createError(404, "News not found"));
  res.json({ success: true, data: news });
});

const createNewsController = asyncHandler(async (req, res) => {
  const { title, summary, content, image_url, published_at } = req.body;
  const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : image_url;
  
  // Format datetime for MySQL
  let finalPublishedAt = published_at;
  if (published_at) {
    const date = new Date(published_at);
    finalPublishedAt = date.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  const id = await createNews({ title, summary, content, image_url: finalImageUrl, published_at: finalPublishedAt });
  const created = await getNewsById(id);
  res.status(201).json({ success: true, data: created });
});

const updateNewsController = asyncHandler(async (req, res, next) => {
  const updates = { ...req.body };
  if (req.file) {
    updates.image_url = `/uploads/${req.file.filename}`;
  }
  
  // Format datetime for MySQL
  if (updates.published_at) {
    const date = new Date(updates.published_at);
    updates.published_at = date.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  const ok = await updateNewsById(req.params.id, updates);
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
