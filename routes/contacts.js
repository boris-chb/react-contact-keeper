const express = require("express");

const router = express.Router();

// @route   GET    api/contact
// @desc    Get all User Contacts
// @access  Private (has to be Auth)
router.get("/", (req, res) => {
  res.send("Get all contacts");
});

// @route   POST    api/contact
// @desc    Create a new Contact
// @access  Private (has to be Auth)
router.post("/", (req, res) => {
  res.send("Creating Contact");
});

// @route   PUT    api/contact/:id
// @desc    Update an existing Contact
// @access  Private (has to be Auth)
router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.json({
    message: `Create successfully Contact ${id}`,
  });
});

// @route   DELETE    api/contact/:id
// @desc    Delete an existing Contact
// @access  Private (has to be Auth)
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.json({
    message: `Deleted successfully Contact ${id}`,
  });
});

module.exports = router;
