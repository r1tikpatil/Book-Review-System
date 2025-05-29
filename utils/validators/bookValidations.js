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

module.exports = {
  bookSchema,
  querySchema,
};
