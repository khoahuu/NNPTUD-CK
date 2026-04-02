const express = require("express");
const {
  listBooks,
  getBook,
  createBookController,
  updateBookController,
  uploadBookCover,
  deleteBookController,
} = require("../controllers/book");
const { requireAuth, requireRole } = require("../utils/auth");
const upload = require("../utils/upload");
const validate = require("../utils/validate");
const { bookValidator, uploadCoverValidator } = require("../validators/book");

const router = express.Router();

router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", requireAuth, requireRole("admin"), bookValidator, validate, createBookController);
router.patch("/:id", requireAuth, requireRole("admin"), bookValidator, validate, updateBookController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteBookController);
router.post(
  "/upload-cover",
  requireAuth,
  requireRole("admin"),
  upload.single("image"),
  uploadCoverValidator,
  validate,
  uploadBookCover
);

module.exports = router;
