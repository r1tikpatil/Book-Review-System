// validations/bookValidations.js
const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().max(200).required(),
  author: Joi.string().max(100).required(),
  genre: Joi.string().max(50).required(),
  description: Joi.string().max(1000).optional().allow(""),
  publishedYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  isbn: Joi.string().optional().allow(""),
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  author: Joi.string().optional(),
  genre: Joi.string().optional(),
});

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).optional().allow(""),
});

const reviewQuerySchema = Joi.object({
  reviewPage: Joi.number().integer().min(1).optional(),
  reviewLimit: Joi.number().integer().min(1).max(50).optional(),
});

const searchQuerySchema = Joi.object({
  q: Joi.string().trim().required().messages({
    "any.required": "Search query is required",
    "string.empty": "Search query is required",
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

module.exports = {
  bookSchema,
  querySchema,
  reviewSchema,
  reviewQuerySchema,
  searchQuerySchema,
};
