require("dotenv").config();
const pool = require("./db");

async function initWishlistsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS wishlists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wishlist (user_id, book_id)
      )
    `;
    await pool.query(createTableQuery);
    console.log("Table 'wishlists' is ready.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating wishlists table:", error);
    process.exit(1);
  }
}

initWishlistsTable();
