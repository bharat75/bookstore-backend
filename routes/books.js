const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const mongoose = require("mongoose");

// @route   POST /api/books
// @desc    Add a new book
// @access  Public
router.post("/", async (req, res) => {
  const { title, author, description } = req.body;

  // Validation: check if fields are present
  if (!title || !author) {
    return res
      .status(400)
      .json({ msg: "Please include both title and author" });
  }

  try {
    const newBook = new Book({
      title,
      author,
      description,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook); // Return the saved book
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.json(books); // Return the books as a JSON response
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid book ID format" });
    }

    // Find the book by ID
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    // Delete the book
    await Book.findByIdAndDelete(req.params.id); // Use findByIdAndDelete instead of book.remove

    res.json({ msg: "Book deleted successfully" });
  } catch (error) {
    console.error("Error while deleting book:", error.message); // Log the error message
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
