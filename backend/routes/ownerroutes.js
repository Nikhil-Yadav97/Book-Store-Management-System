import express from "express";
import { Store } from "../models/Store.js";
import Transaction from "../models/Transactions.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { requireSeller } from "../middleware/requireSeller.js";

const router = express.Router();

/* =====================================================
   OWNER → DEPOSIT MONEY INTO STORE
   POST /owners/stores/:storeId/deposit
===================================================== */
router.post(
  "/stores/:storeId/deposit",
  verifyToken,
  requireSeller,
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const { amount } = req.body;
      const ownerId = req.user.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount" });
      }

      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      if (store.owner.toString() !== ownerId) {
        return res.status(403).json({ message: "Not your store" });
      }

      // Update store balance
      store.balance += amount;
      await store.save();

      // Create transaction
      const transaction = await Transaction.create({
        store: store._id,
        owner: ownerId,
        type: "OWNER_DEPOSIT",
        direction: "CREDIT",
        amount,
        balanceAfter: store.balance
      });

      return res.status(201).json({
        message: "Deposit successful",
        storeBalance: store.balance,
        transaction
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   OWNER → WITHDRAW MONEY FROM STORE
   POST /owners/stores/:storeId/withdraw
===================================================== */
router.post(
  "/stores/:storeId/withdraw",
  verifyToken,
  requireSeller,
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const { amount } = req.body;
      const ownerId = req.user.id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdraw amount" });
      }

      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      if (store.owner.toString() !== ownerId) {
        return res.status(403).json({ message: "Not your store" });
      }

      if (store.balance < amount) {
        return res.status(400).json({ message: "Insufficient store balance" });
      }

      // Deduct balance
      store.balance -= amount;
      await store.save();

      // Create transaction
      const transaction = await Transaction.create({
        store: store._id,
        owner: ownerId,
        type: "OWNER_WITHDRAW",
        direction: "DEBIT",
        amount,
        balanceAfter: store.balance
      });

      return res.status(200).json({
        message: "Withdrawal successful",
        storeBalance: store.balance,
        transaction
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   OWNER → VIEW STORE TRANSACTIONS
   GET /owners/stores/:storeId/transactions
===================================================== */
router.get(
  "/stores/:storeId/transactions",
  verifyToken,
  requireSeller,
  async (req, res) => {
    try {
      const { storeId } = req.params;
      const ownerId = req.user.id;

      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      if (store.owner.toString() !== ownerId) {
        return res.status(403).json({ message: "Not your store" });
      }

      const transactions = await Transaction.find({ store: storeId })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        storeBalance: store.balance,
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
