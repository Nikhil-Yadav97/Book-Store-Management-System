import express from "express";
import { Book } from "../models/bookModels.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { requireSeller } from "../middleware/requireSeller.js";


const router = express.Router();

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
   BUY A BOOK (USER PURCHASE)
   POST /books/:id/buy
   Requires: logged-in user with sufficient balance
   Effects: reduces book.copies, debits user.balance, credits store.balance by margin, creates Order and Transactions
   ========================= */
router.post("/:id/buy", verifyToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { quantity = 1 } = req.body;
    if (quantity <= 0) return res.status(400).json({ message: "Invalid quantity" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.copies < quantity) return res.status(400).json({ message: "Not enough copies available" });

    const { User } = await import("../models/User.js");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { Store } = await import("../models/Store.js");
    const store = await Store.findById(book.store);
    if (!store) return res.status(404).json({ message: "Store not found" });

    const totalPrice = Number(book.price) * quantity;

    // check user balance (this app has user balance)
    if (user.balance < totalPrice) return res.status(400).json({ message: "Insufficient user balance" });

    // deduct user balance
    user.balance -= totalPrice;
    await user.save();

    // reduce copies
    book.copies -= quantity;
    await book.save();

    // compute margin and credit store
    const marginEarned = (store.marginPercent / 100) * totalPrice;
    store.balance += marginEarned;
    await store.save();

    // create order
    const { Order } = await import("../models/Order.js");

    const order = await Order.create({
      user: user._id,
      store: store._id,
      book: book._id,
      pricePaid: totalPrice,
      marginEarned
    });

    // create transactions
    const Transaction = (await import("../models/Transactions.js")).default;

    const userTx = await Transaction.create({
      user: user._id,
      store: store._id,
      type: "BOOK_PURCHASE",
      direction: "DEBIT",
      amount: totalPrice,
      balanceAfter: user.balance,
      reference: { bookId: book._id, orderId: order._id }
    });

    const ownerTx = await Transaction.create({
      owner: store.owner,
      store: store._id,
      type: "OWNER_EARNING",
      direction: "CREDIT",
      amount: marginEarned,
      balanceAfter: store.balance,
      reference: { bookId: book._id, orderId: order._id }
    });

    return res.status(201).json({ message: "Purchase successful", order, transactions: [userTx, ownerTx], storeBalance: store.balance });
  } catch (error) {
    console.error(error);
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
      owner: req.user.id,       
      store: req.user.storeId,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/:id", verifyToken, requireSeller, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized to update this book",
      });
    }

    // Calculate inventory value delta
    const oldPrice = Number(book.price || 0);
    const oldCopies = Number(book.copies || 0);
    const oldValue = oldPrice * oldCopies;

    const newPrice = req.body.price !== undefined ? Number(req.body.price) : oldPrice;
    const newCopies = req.body.copies !== undefined ? Number(req.body.copies) : oldCopies;
    const newValue = newPrice * newCopies;

    const delta = newValue - oldValue; // >0 means owner must pay more (withdraw), <0 refund to store

    // If delta > 0: check store balance and withdraw
    if (delta > 0) {
      const { Store } = await import("../models/Store.js");
      const store = await Store.findById(book.store);
      if (!store) return res.status(404).json({ message: "Store not found" });

      if (store.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your store" });
      }

      if (store.balance < delta) {
        return res.status(400).json({ message: "Insufficient store balance for update" });
      }

      store.balance -= delta;
      await store.save();

      const Transaction = (await import("../models/Transactions.js")).default;
      await Transaction.create({
        owner: req.user.id,
        store: store._id,
        type: "OWNER_WITHDRAW",
        direction: "DEBIT",
        amount: delta,
        balanceAfter: store.balance,
        reference: { note: "Stock addition" }
      });
    } else if (delta < 0) {
      // refund to store
      const refund = -delta;
      const { Store } = await import("../models/Store.js");
      const store = await Store.findById(book.store);
      if (!store) return res.status(404).json({ message: "Store not found" });

      if (store.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your store" });
      }

      store.balance += refund;
      await store.save();

      const Transaction = (await import("../models/Transactions.js")).default;
      await Transaction.create({
        owner: req.user.id,
        store: store._id,
        type: "OWNER_DEPOSIT",
        direction: "CREDIT",
        amount: refund,
        balanceAfter: store.balance,
        reference: { note: "Stock reduction refund" }
      });
    }

    // Apply updates
    Object.assign(book, req.body);
    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

/* =========================
   UPDATE STOCK (ONLY OWNER)
   POST /books/:id/stock
   Adjusts store balance when copies change (selling or restocking)
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

    const oldCopies = Number(book.copies || 0);
    const newCopies = Number(copies);
    const price = Number(book.price || 0);

    const { Store } = await import("../models/Store.js");
    const store = await Store.findById(book.store);
    if (!store) return res.status(404).json({ message: "Store not found" });

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your store" });
    }

    if (newCopies > oldCopies) {
      // owner adds stock — withdraw store by price * addedCopies
      const added = newCopies - oldCopies;
      const withdraw = added * price;

      if (store.balance < withdraw) {
        return res.status(400).json({ message: "Insufficient store balance to add stock" });
      }

      store.balance -= withdraw;
      await store.save();

      const Transaction = (await import("../models/Transactions.js")).default;
      await Transaction.create({
        owner: req.user.id,
        store: store._id,
        type: "OWNER_WITHDRAW",
        direction: "DEBIT",
        amount: withdraw,
        balanceAfter: store.balance,
        reference: { note: "Stock addition" }
      });
    } else if (newCopies < oldCopies) {
      // owner sold some copies — credit store by margin% * price * sold
      const sold = oldCopies - newCopies;
      const marginEarned = (store.marginPercent / 100) * price * sold;

      store.balance += marginEarned;
      await store.save();

      const Transaction = (await import("../models/Transactions.js")).default;
      await Transaction.create({
        owner: req.user.id,
        store: store._id,
        type: "OWNER_EARNING",
        direction: "CREDIT",
        amount: marginEarned,
        balanceAfter: store.balance,
        reference: { note: "Sold stock" }
      });
    }

    book.copies = newCopies;
    await book.save();

    res.status(200).json({ message: "Stock updated successfully", data: book, storeBalance: store.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   DELETE BOOK (ONLY OWNER)
   ========================= */
router.delete("/:id", verifyToken, requireSeller, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized to delete this book",
      });
    }

    // refund remaining stock value to store
    const refundAmount = Number(book.price || 0) * Number(book.copies || 0);
    const { Store } = await import("../models/Store.js");
    const store = await Store.findById(book.store);
    if (!store) return res.status(404).json({ message: "Store not found" });

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your store" });
    }

    if (refundAmount > 0) {
      store.balance += refundAmount;
      await store.save();

      const Transaction = (await import("../models/Transactions.js")).default;
      await Transaction.create({
        owner: req.user.id,
        store: store._id,
        type: "OWNER_DEPOSIT",
        direction: "CREDIT",
        amount: refundAmount,
        balanceAfter: store.balance,
        reference: { note: "Refund on book deletion" }
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Book deleted successfully", refund: refundAmount, storeBalance: store.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
