import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    pricePaid: {
      type: Number,
      required: true
    },

    marginEarned: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["SUCCESS", "REFUNDED"],
      default: "SUCCESS"
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
