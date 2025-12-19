import express from "express";
import { Store } from "../models/Store.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();
router.get("/me", verifyToken, async (req, res) => {
    try {
        if (!req.user.storeId) {
            return res.status(404).json({ message: "No store found for user" });
        }

        const store = await Store.findById(req.user.storeId);

        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
