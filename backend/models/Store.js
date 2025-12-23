import mongoose from "mongoose"
import { User } from "./User.js";


const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,   
        required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    balance:{
        type: Number,
        default: 0,

    },
    marginPercent: {
      type: Number,
      default: 10, 
      min: 0,
      max: 100
    }
},
    {
        timestamps: true,
    })
export const Store = mongoose.model("Store", storeSchema);