const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { getBookById } = require("../schemas/book");
const {
  getCartDetailByUserId,
  addOrUpdateCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} = require("../schemas/cart");

const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getCartDetailByUserId(req.user.id);
  res.json({ success: true, data: cart });
});

const addCartItem = asyncHandler(async (req, res, next) => {
  const { book_id, quantity } = req.body;
  if (!book_id || !quantity) return next(createError(400, "book_id and quantity are required"));
  const book = await getBookById(book_id);
  if (!book) return next(createError(404, "Book not found"));
  if (Number(quantity) <= 0) return next(createError(400, "quantity must be greater than 0"));
  if (Number(quantity) > Number(book.stock)) return next(createError(400, "quantity exceeds available stock"));

  await addOrUpdateCartItem(req.user.id, Number(book_id), Number(quantity));
  const cart = await getCartDetailByUserId(req.user.id);
  res.status(201).json({ success: true, data: cart });
});

const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  if (!quantity || Number(quantity) <= 0) return next(createError(400, "quantity must be greater than 0"));
  const ok = await updateCartItemQuantity(req.user.id, req.params.id, Number(quantity));
  if (!ok) return next(createError(404, "Cart item not found"));
  const cart = await getCartDetailByUserId(req.user.id);
  res.json({ success: true, data: cart });
});

const removeCartItem = asyncHandler(async (req, res, next) => {
  const ok = await deleteCartItem(req.user.id, req.params.id);
  if (!ok) return next(createError(404, "Cart item not found"));
  res.json({ success: true, message: "Cart item deleted" });
});

module.exports = {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
};
