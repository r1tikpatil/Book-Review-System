const express = require("express");
const { signUpUser, loginUser } = require("../contollers/auth");

const router = express.Router();

// POST /signup - Register new user
router.post("/signup", signUpUser);

// POST /login - Authenticate user
router.post("/login", loginUser);

module.exports = router;
