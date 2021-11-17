const express = require("express");

const router = express.Router();

// @route   POST    api/users
// @desc    Register a new User
// @access  Public
router.post("/", (req, res) => {
  res.send("Registering an User");
});

module.exports = router;
