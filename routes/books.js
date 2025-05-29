const express = require("express");
const authMiddleware = require("../middleware/auth");
const { addNewBook, getAllBooks } = require("../contollers/book");

const router = express.Router();

// POST /books - Add new book (Authenticated)
router.post("/", authMiddleware, addNewBook);

// GET /books - Get all books with pagination and filters
router.get("/", getAllBooks);
