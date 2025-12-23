import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publishYear: {
        type: Number,
        required: true,
    },
    copies: {
        type: Number,
        required: true,
        default: 1
    },
    description: {
        type: String,
        required: true,

    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    }
    ,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    genre: {
        type: [String],
        enum: ["General", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Motivational", "Biography", "History", "Science", "Romance", "Thriller", "Mystery", "Horror"],
        default: ["General"]
    }
},
    {
        timestamps: true,
    })
export const Book = mongoose.model("Book", bookSchema);