require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authorRoutes = require("./routes/author");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const bookRoutes = require("./routes/book");
const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");
const orderRoutes = require("./routes/order");
const reviewRoutes = require("./routes/review");
const wishlistRoutes = require("./routes/wishlist");
const newsRoutes = require("./routes/news");
const notificationRoutes = require("./routes/notification");
const { notFoundHandler, errorHandler } = require("./utils/error");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.json({ message: "Bookstore API is running" });
});

app.use("/authors", authorRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/coupons", couponRoutes);
app.use("/wishlists", wishlistRoutes);
app.use("/news", newsRoutes);
app.use("/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
