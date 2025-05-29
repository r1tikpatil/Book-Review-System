const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per book
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

// Update book's average rating when review is saved
reviewSchema.post("save", async function () {
  await this.constructor.updateBookRating(this.book);
});

// Update book's average rating when review is removed
reviewSchema.post("remove", async function () {
  await this.constructor.updateBookRating(this.book);
});

// Static method to update book rating
reviewSchema.statics.updateBookRating = async function (bookId) {
  const Book = mongoose.model("Book");
  const stats = await this.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalRatings: stats[0].totalRatings,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 0,
      totalRatings: 0,
    });
  }
};

module.exports = mongoose.model("Review", reviewSchema);
