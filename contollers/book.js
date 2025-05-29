const Book = require("../models/Book");
const {
  bookSchema,
  querySchema,
} = require("../utils/validators/bookValidations");

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

exports.getAllBooks = async (req, res) => {
  try {
    const { error } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.author)
      filter.author = { $regex: req.query.author, $options: "i" };
    if (req.query.genre)
      filter.genre = { $regex: req.query.genre, $options: "i" };

    const books = await Book.find(filter)
      .populate("addedBy", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "",
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get books error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error while fetching books" });
  }
};
