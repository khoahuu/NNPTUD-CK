const express = require("express");
const {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cart");
const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.get("/", requireAuth, getMyCart);
router.post("/items", requireAuth, addCartItem);
router.patch("/items/:id", requireAuth, updateCartItem);
router.delete("/items/:id", requireAuth, removeCartItem);

module.exports = router;
