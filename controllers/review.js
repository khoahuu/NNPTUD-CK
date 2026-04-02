const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { getBookById } = require("../schemas/book");
const {
  createReview,
  getReviewsByBookId,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} = require("../schemas/review");

const listReviewsByBook = asyncHandler(async (req, res) => {
  const rows = await getReviewsByBookId(req.params.bookId);
  res.json({ success: true, data: rows });
});

const createReviewController = asyncHandler(async (req, res, next) => {
  const { book_id, rating, comment } = req.body;
  const score = Number(rating);

  const book = await getBookById(book_id);
  if (!book) return next(createError(404, "Book not found"));

  const id = await createReview({
    userId: req.user.id,
    bookId: Number(book_id),
    rating: score,
    comment,
  });
  const review = await getReviewById(id);
  res.status(201).json({ success: true, data: review });
});

const updateReviewController = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const score = Number(rating);

  const review = await getReviewById(req.params.id);
  if (!review) return next(createError(404, "Review not found"));
  if (req.user.role !== "admin" && Number(review.user_id) !== Number(req.user.id)) {
    return next(createError(403, "Forbidden"));
  }

  await updateReviewById(req.params.id, { rating: score, comment });
  const updated = await getReviewById(req.params.id);
  res.json({ success: true, data: updated });
});

const deleteReviewController = asyncHandler(async (req, res, next) => {
  const review = await getReviewById(req.params.id);
  if (!review) return next(createError(404, "Review not found"));
  if (req.user.role !== "admin" && Number(review.user_id) !== Number(req.user.id)) {
    return next(createError(403, "Forbidden"));
  }

  await deleteReviewById(req.params.id);
  res.json({ success: true, message: "Review deleted" });
});

module.exports = {
  listReviewsByBook,
  createReviewController,
  updateReviewController,
  deleteReviewController,
};
