const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Contact = require("../models/Contact");
const User = require("../models/User");

const router = express.Router();

const serverError = (res) => {
  return res.status(500).send("Server Error");
};

// @route   GET    api/contact
// @desc    Get all User Contacts
// @access  Private (has to be Auth)
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST    api/contact
// @desc    Create a new Contact
// @access  Private (has to be Auth)
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT    api/contact/:id
// @desc    Update an existing Contact
// @access  Private (has to be Auth)
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Create contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ message: "Contact not found" });

    // Check Auth
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not Authorized" });

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (error) {
    serverError(res);
  }
});

// @route   DELETE    api/contact/:id
// @desc    Delete an existing Contact
// @access  Private (has to be Auth)
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ message: "Contact not found" });

    // Check Auth
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not Authorized" });

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ message: `Contact ${req.params.id} removed successfully.` });
  } catch (error) {
    serverError(res);
  }
});

module.exports = router;
