const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  updateBookImage,
  deleteBookById,
} = require("../schemas/book");

const listBooks = asyncHandler(async (req, res) => {
  const rows = await getBooks();
  res.json({ success: true, data: rows });
});

const getBook = asyncHandler(async (req, res, next) => {
  const book = await getBookById(req.params.id);
  if (!book) return next(createError(404, "Book not found"));
  res.json({ success: true, data: book });
});

const createBookController = asyncHandler(async (req, res, next) => {
  const { title, author_id, price, stock, category_id, image_url, description } = req.body;
  const id = await createBook({ title, author_id, price, stock, category_id, image_url, description });
  const book = await getBookById(id);
  res.status(201).json({ success: true, data: book });
});

const updateBookController = asyncHandler(async (req, res, next) => {
  const { title, author_id, price, stock, category_id, image_url, description } = req.body;
  const ok = await updateBookById(req.params.id, { title, author_id, price, stock, category_id, image_url, description });
  if (!ok) return next(createError(404, "Book not found"));
  const book = await getBookById(req.params.id);
  res.json({ success: true, data: book });
});

const uploadBookCover = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(createError(400, "Image file is required"));
  const { bookId } = req.body;
  const book = await getBookById(bookId);
  if (!book) return next(createError(404, "Book not found"));

  const imageUrl = `/uploads/${req.file.filename}`;
  await updateBookImage(bookId, imageUrl);
  const updated = await getBookById(bookId);
  res.json({ success: true, data: updated });
});

const deleteBookController = asyncHandler(async (req, res, next) => {
  const ok = await deleteBookById(req.params.id);
  if (!ok) return next(createError(404, "Book not found"));
  res.json({ success: true, message: "Book deleted" });
});

module.exports = {
  listBooks,
  getBook,
  createBookController,
  updateBookController,
  uploadBookCover,
  deleteBookController,
};
