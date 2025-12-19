import express from "express";
import { Book } from "../models/bookModels.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { requireSeller } from "../middleware/requireSeller.js";

const router = express.Router();

/* =========================
   GET ALL BOOKS (optional store filter)
   ========================= */
router.get("/", async (req, res) => {
  try {
    const { storeId } = req.query;

    // If storeId is provided, return only books for that store
    const filter = storeId ? { store: storeId } : {};

    const books = await Book.find(filter);
    res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GET BOOK BY ID
   ========================= */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   CREATE BOOK (OWNER ONLY)
   ========================= */
router.post("/", verifyToken, requireSeller, async (req, res) => {
  try {
    const { title, author, publishYear, copies, description, genre, price } =
      req.body;

    if (!title || !author || !publishYear || !copies || !price) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const book = await Book.create({
      title,
      author,
      publishYear,
      copies,
      description,
      genre,
      price,
      owner: req.user.id,       // 🔑 FROM JWT
      store: req.user.storeId,  // 🔑 FROM JWT
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   UPDATE BOOK (ONLY OWNER)
   ========================= */
router.put("/:id", verifyToken, requireSeller, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user.id, // 🔒 ownership check
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized to update this book",
      });
    }

    Object.assign(book, req.body);
    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   UPDATE STOCK (ONLY OWNER)
   ========================= */
router.put("/:id/stock", verifyToken, requireSeller, async (req, res) => {
  try {
    const { copies } = req.body;

    if (copies === undefined || copies < 0) {
      return res.status(400).json({ message: "Invalid copies value" });
    }

    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized to update stock",
      });
    }

    book.copies = copies;
    await book.save();

    res.status(200).json({
      message: "Stock updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   DELETE BOOK (ONLY OWNER)
   ========================= */
router.delete("/:id", verifyToken, requireSeller, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized to delete this book",
      });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
