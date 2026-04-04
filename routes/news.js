const express = require("express");
const {
  listNews,
  getNews,
  createNewsController,
  updateNewsController,
  deleteNewsController,
} = require("../controllers/news");
const { requireAuth, requireRole } = require("../utils/auth");
const upload = require("../utils/upload");
const validate = require("../utils/validate");
const { newsValidator, newsUpdateValidator } = require("../validators/index");

const router = express.Router();

router.get("/", listNews);
router.get("/:id", getNews);
router.post("/", requireAuth, requireRole("admin"), upload.single("image"), newsValidator, validate, createNewsController);
router.patch("/:id", requireAuth, requireRole("admin"), upload.single("image"), newsUpdateValidator, validate, updateNewsController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteNewsController);

module.exports = router;
