require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const bookRoutes = require("./routes/book");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const reviewRoutes = require("./routes/review");
const { notFoundHandler, errorHandler } = require("./utils/error");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Bookstore API is running" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
