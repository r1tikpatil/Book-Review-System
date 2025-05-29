const express = require("express");
const authMiddleware = require("../middleware/auth");
const { updateReview, deleteReview } = require("../contollers/review");

const router = express.Router();

router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
