const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { getBookById } = require("../schemas/book");
const { getWishlistByUserId, addWishlist, removeWishlist, checkInWishlist } = require("../schemas/wishlist");

const getMyWishlist = asyncHandler(async (req, res) => {
  const items = await getWishlistByUserId(req.user.id);
  res.json({ success: true, data: items });
});

const addToWishlist = asyncHandler(async (req, res, next) => {
  const { bookId } = req.body;
  if (!bookId) return next(createError(400, "bookId is required"));

  const book = await getBookById(bookId);
  if (!book) return next(createError(404, "Book not found"));

  await addWishlist(req.user.id, bookId);
  const items = await getWishlistByUserId(req.user.id);
  res.status(201).json({ success: true, message: "Added to wishlist", data: items });
});

const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;
  if (!bookId) return next(createError(400, "bookId is required"));

  const isRemoved = await removeWishlist(req.user.id, bookId);
  if (!isRemoved) return next(createError(404, "Book not found in wishlist"));

  const items = await getWishlistByUserId(req.user.id);
  res.json({ success: true, message: "Removed from wishlist", data: items });
});

module.exports = {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
};
