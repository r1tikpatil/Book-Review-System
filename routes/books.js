const express = require("express");
const authMiddleware = require("../middleware/auth");
const { addNewBook } = require("../contollers/book");

const router = express.Router();

// POST /books - Add new book (Authenticated)
router.post("/", authMiddleware, addNewBook);
