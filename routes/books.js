const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  addNewBook,
  getAllBooks,
  getBookDetail,
  submitReview,
} = require("../contollers/book");

const router = express.Router();

// POST /books - Add new book (Authenticated)
router.post("/", authMiddleware, addNewBook);

// GET /books - Get all books with pagination and filters
router.get("/", getAllBooks);

// GET /books/:id - Get book details with reviews
router.get("/:id", getBookDetail);

// POST /books/:id/reviews - Submit review (Authenticated)
router.post("/:id/reviews", authMiddleware, submitReview);

module.exports = router;
