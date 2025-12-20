import express, { request } from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import BookRoutes from './routes/BookRoutes.js'
import storeRoutes from './routes/storeRoutes.js'
import ownerroutes from './routes/ownerroutes.js';
import userroutes from './routes/userroutes.js';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: 'Content-Type,Authorization'
    }
));

// DB check
app.get("/", (req, res) => {
    return res.status(200).send("Welcome to MERN Stack Tutorial");
});

app.use('/books', BookRoutes)
app.use('/auth', authRoutes);
app.use('/stores', storeRoutes);
app.use('/owner', ownerroutes);
app.use('/users', userroutes);

// DB Connection + Server Start
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("Connected to MongoDB Atlas");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });


