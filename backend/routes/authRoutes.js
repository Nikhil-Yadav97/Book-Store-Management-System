import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/User.js";
import { Store } from "../models/Store.js";

dotenv.config();

const router = express.Router();

/* =========================
   REGISTER
   ========================= */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, storeName, storeAddress } = req.body;

        // 1️⃣ Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password required" });
        }

        // 2️⃣ Owner must provide store details
        if (role === "Owner" && (!storeName || !storeAddress)) {
            return res.status(400).json({ message: "Store name and address required for owner" });
        }

        // 3️⃣ Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 4️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5️⃣ Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        let store = null;

        // 6️⃣ Create store ONLY if Owner
        if (role === "Owner") {
            store = await Store.create({
                name: storeName,
                location: storeAddress,
                owner: user._id, // 🔑 one owner → one store
            });

            // link store to user
            user.store = store._id;
            await user.save();
        }

        // 7️⃣ Generate JWT (include storeId, name, email)
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                storeId: store ? store._id : null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 8️⃣ Response
        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                store: store ? store._id : null,
            },
        });
    } catch (error) {
        // Mongo duplicate key error (one owner → one store)
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Owner already has a store",
            });
        }

        res.status(500).json({ message: error.message });
    }
});

/* =========================
   LOGIN
   ========================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validate
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // 2️⃣ Find user + populate store
        const user = await User.findOne({ email }).populate("store");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 4️⃣ Generate token (include name and email)
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                storeId: user.store ? user.store._id : null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5️⃣ Response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                store: user.store ? user.store._id : null,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
