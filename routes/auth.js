const express = require("express");
const { signUpUser } = require("../contollers/auth");

const router = express.Router();

// POST /signup - Register new user
router.post("/signup", signUpUser);
