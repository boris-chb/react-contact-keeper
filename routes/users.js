const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const { genSalt, hash } = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Models
const User = require("../models/User");

// Validation
const validation = [
  check("name", "Please enter a name").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Please enter a password (6+ characters)").isLength({
    min: 6,
  }),
];

// @route   POST    api/users
// @desc    Register a new User
// @access  Public
router.post(
  "/",
  [...validation],
  // Create user. Return token
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists in DB
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user in DB
      user = new User({
        name,
        email,
        password,
      });

      // Hash Password
      const salt = await genSalt(10);
      user.password = await hash(password, salt);
      await user.save();

      // JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
