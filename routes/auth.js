const express = require("express");

const router = express.Router();

// @route   GET    api/auth
// @desc    Fetching an logged user
// @access  Private
router.get("/", (req, res) => {
  res.send("Fetching logged in user");
});

// @route   POST    api/auth
// @desc    Auth an user & get token
// @access  Public
router.post("/", (req, res) => {
  res.send("Auth the User and get JWT");
});

module.exports = router;
