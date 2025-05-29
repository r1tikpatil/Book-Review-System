const Book = require("../models/Book");
const { bookSchema } = require("../utils/validators/bookValidations");

exports.addNewBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details,
      });
    }

    const bookData = {
      ...req.body,
      addedBy: req.user._id,
    };

    const book = new Book(bookData);
    await book.save();
    await book.populate("addedBy", "username");

    return res
      .status(201)
      .json({ success: true, message: "Book added successfully", book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }
    console.error("Add book error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while adding book" });
  }
};
