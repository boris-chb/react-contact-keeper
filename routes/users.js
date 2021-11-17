const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

// Models
const User = require("../models/User");

// @route   POST    api/users
// @desc    Register a new User
// @access  Public
router.post(
  "/",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password (6+ characters)").isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("Success");
  }
);

module.exports = router;
