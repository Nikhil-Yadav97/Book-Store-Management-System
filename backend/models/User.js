import mongoose from "mongoose"
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Owner", "User"],
        default: "User"
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    }
},
    {
        timestamps: true,
    })

// User model class User convt to users in collection
// mongoose.model is api used to create model
export const User = mongoose.model("User", UserSchema);