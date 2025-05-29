const Book = require("../models/Book");
const Review = require("../models/Review");
const {
  bookSchema,
  querySchema,
  reviewQuerySchema,
} = require("../utils/validators/bookValidations");
const { searchQuerySchema } = require("../utils/validators/bookValidator");

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
      message: "Books fetched successfully",
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

exports.getBookDetail = async (req, res) => {
  try {
    const { error } = reviewQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        data: error.details,
      });
    }

    const book = await Book.findById(req.params.id).populate(
      "addedBy",
      "username"
    );
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    const reviewPage = parseInt(req.query.reviewPage) || 1;
    const reviewLimit = parseInt(req.query.reviewLimit) || 10;
    const reviewSkip = (reviewPage - 1) * reviewLimit;

    const reviews = await Review.find({ book: book._id })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(reviewSkip)
      .limit(reviewLimit);

    const totalReviews = await Review.countDocuments({ book: book._id });
    const totalReviewPages = Math.ceil(totalReviews / reviewLimit);

    return res.status(200).json({
      success: true,
      message: "Book details fetched successfully",
      data: {
        book,
        reviews,
        reviewPagination: {
          currentPage: reviewPage,
          totalPages: totalReviewPages,
          totalReviews,
          hasNext: reviewPage < totalReviewPages,
          hasPrev: reviewPage > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get book details error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching book details",
      data: null,
    });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        data: error.details,
      });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      book: book._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
        data: null,
      });
    }

    const review = new Review({
      user: req.user._id,
      book: book._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await review.save();
    await review.populate("user", "username");

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("Submit review error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting review",
      data: null,
    });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { error, value } = searchQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        data: error.details,
      });
    }

    const { q, page, limit } = value;

    const skip = (page - 1) * limit;

    const books = await Book.find({
      title: { $regex: q, $options: "i" },
    })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments({
      title: { $regex: q, $options: "i" },
    });

    return res.json({
      success: true,
      message: "Books fetched successfully",
      data: {
        results: books,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("Search books error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while searching books",
      data: null,
    });
  }
};
