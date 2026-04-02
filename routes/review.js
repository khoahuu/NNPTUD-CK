const express = require("express");
const {
  listReviewsByBook,
  createReviewController,
  updateReviewController,
  deleteReviewController,
} = require("../controllers/review");
const { requireAuth } = require("../utils/auth");
const validate = require("../utils/validate");
const { reviewValidator, updateReviewValidator } = require("../validators/index");

const router = express.Router();

router.get("/book/:bookId", listReviewsByBook);
router.post("/", requireAuth, reviewValidator, validate, createReviewController);
router.patch("/:id", requireAuth, updateReviewValidator, validate, updateReviewController);
router.delete("/:id", requireAuth, deleteReviewController);

module.exports = router;
