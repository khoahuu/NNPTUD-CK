const express = require("express");
const {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cart");
const { requireAuth } = require("../utils/auth");
const validate = require("../utils/validate");
const { cartItemValidator, updateCartItemValidator } = require("../validators/index");

const router = express.Router();

router.get("/", requireAuth, getMyCart);
router.post("/items", requireAuth, cartItemValidator, validate, addCartItem);
router.patch("/items/:id", requireAuth, updateCartItemValidator, validate, updateCartItem);
router.delete("/items/:id", requireAuth, removeCartItem);

module.exports = router;
