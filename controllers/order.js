const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { getBookById } = require("../schemas/book");
const {
  getCartDetailByUserId,
  clearCart,
} = require("../schemas/cart");
const {
  createOrderWithItems,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
} = require("../schemas/order");

const createOrder = asyncHandler(async (req, res, next) => {
  const { shipping_address } = req.body;

  const cart = await getCartDetailByUserId(req.user.id);
  if (!cart.items.length) return next(createError(400, "Cart is empty"));

  const normalizedItems = [];
  for (const item of cart.items) {
    const book = await getBookById(item.book_id);
    if (!book) return next(createError(400, `Book not found: ${item.book_id}`));
    if (Number(item.quantity) > Number(book.stock)) {
      return next(createError(400, `Not enough stock for book: ${book.title}`));
    }
    normalizedItems.push({
      book_id: item.book_id,
      quantity: item.quantity,
      price: book.price,
    });
  }

  const orderId = await createOrderWithItems({
    userId: req.user.id,
    shippingAddress: shipping_address,
    items: normalizedItems,
  });
  await clearCart(cart.cart.id);
  const order = await getOrderById(orderId);
  const items = await getOrderItems(orderId);
  res.status(201).json({ success: true, data: { ...order, items } });
});

const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => ({
      ...order,
      items: await getOrderItems(order.id),
    }))
  );
  res.json({ success: true, data: ordersWithItems });
});

const listOrders = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();
  res.json({ success: true, data: orders });
});

const changeOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const ok = await updateOrderStatus(req.params.id, status);
  if (!ok) return next(createError(404, "Order not found"));
  const order = await getOrderById(req.params.id);
  res.json({ success: true, data: order });
});

module.exports = {
  createOrder,
  listMyOrders,
  listOrders,
  changeOrderStatus,
};
