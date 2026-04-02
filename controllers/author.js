const asyncHandler = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const { createAuthor, getAuthors, getAuthorById, updateAuthorById, deleteAuthorById } = require("../schemas/author");

const listAuthors = asyncHandler(async (req, res) => {
  const rows = await getAuthors();
  res.json({ success: true, data: rows });
});

const createAuthorController = asyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;
  const id = await createAuthor({ name, bio });
  const author = await getAuthorById(id);
  res.status(201).json({ success: true, data: author });
});

const updateAuthorController = asyncHandler(async (req, res, next) => {
  const { name, bio } = req.body;
  const ok = await updateAuthorById(req.params.id, { name, bio });
  if (!ok) return next(createError(404, "Author not found"));
  const author = await getAuthorById(req.params.id);
  res.json({ success: true, data: author });
});

const deleteAuthorController = asyncHandler(async (req, res, next) => {
  const ok = await deleteAuthorById(req.params.id);
  if (!ok) return next(createError(404, "Author not found"));
  res.json({ success: true, message: "Author deleted" });
});

module.exports = { listAuthors, createAuthorController, updateAuthorController, deleteAuthorController };
