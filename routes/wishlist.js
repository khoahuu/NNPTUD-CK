const express = require("express");
const { getMyWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlist");
const { requireAuth } = require("../utils/auth");
const validate = require("../utils/validate");
const { wishlistValidator } = require("../validators/index");

const router = express.Router();

router.use(requireAuth);

router.get("/", getMyWishlist);
router.post("/", wishlistValidator, validate, addToWishlist);
router.delete("/:bookId", removeFromWishlist);

module.exports = router;
