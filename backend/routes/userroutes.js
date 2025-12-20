import express from "express";
import { User } from "../models/User.js";
import Transaction from "../models/Transactions.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

/* =====================================================
   USER → DEPOSIT MONEY
   POST /users/me/deposit
===================================================== */
router.post(
  "/me/deposit",
  verifyToken,
  async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user balance
      user.balance += amount;
      await user.save();

      // Create transaction
      const transaction = await Transaction.create({
        user: userId,
        type: "USER_DEPOSIT",
        direction: "CREDIT",
        amount,
        balanceAfter: user.balance
      });

      return res.status(201).json({
        message: "Deposit successful",
        userBalance: user.balance,
        transaction
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   USER → WITHDRAW MONEY
   POST /users/me/withdraw
===================================================== */
router.post(
  "/me/withdraw",
  verifyToken,
  async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdraw amount" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Deduct balance
      user.balance -= amount;
      await user.save();

      // Create transaction
      const transaction = await Transaction.create({
        user: userId,
        type: "USER_WITHDRAW",
        direction: "DEBIT",
        amount,
        balanceAfter: user.balance
      });

      return res.status(200).json({
        message: "Withdrawal successful",
        userBalance: user.balance,
        transaction
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   USER → VIEW OWN TRANSACTIONS
   GET /users/me/transactions
===================================================== */
router.get(
  "/me/transactions",
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const transactions = await Transaction.find({ user: userId })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        totalTransactions: transactions.length,
        transactions
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
