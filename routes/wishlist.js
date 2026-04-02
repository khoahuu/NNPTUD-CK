const express = require("express");
const { getMyWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishlist");
const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getMyWishlist);
router.post("/", addToWishlist);
router.delete("/:bookId", removeFromWishlist);

module.exports = router;
