const express = require("express");
const {
  listReviewsByBook,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} = require("../controllers/review");
const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.get("/book/:bookId", listReviewsByBook);
router.post("/", requireAuth, createReviewController);
router.patch("/:id", requireAuth, updateReviewController);
router.delete("/:id", requireAuth, deleteReviewController);

module.exports = router;
