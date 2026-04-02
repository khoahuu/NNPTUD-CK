const express = require("express");
const { listAuthors, createAuthorController, updateAuthorController, deleteAuthorController } = require("../controllers/author");
const { requireAuth, requireRole } = require("../utils/auth");
const validate = require("../utils/validate");
const { authorValidator } = require("../validators/index");

const router = express.Router();

router.get("/", listAuthors);
router.post("/", requireAuth, requireRole("admin"), authorValidator, validate, createAuthorController);
router.patch("/:id", requireAuth, requireRole("admin"), authorValidator, validate, updateAuthorController);
router.delete("/:id", requireAuth, requireRole("admin"), deleteAuthorController);

module.exports = router;
