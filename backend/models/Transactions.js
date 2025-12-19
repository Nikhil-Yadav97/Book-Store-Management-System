import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // Who initiated / paid
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // Store involved (if any)
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store"
    },

    // Owner snapshot (important for audit)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    type: {
      type: String,
      enum: [
        "USER_DEPOSIT",
        "USER_WITHDRAW",
        "BOOK_PURCHASE",
        "OWNER_EARNING",
        "OWNER_DEPOSIT",
        "OWNER_WITHDRAW"
      ],
      required: true
    },

    direction: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    // Snapshot of balance after transaction
    balanceAfter: {
      type: Number,
      required: true
    },

    reference: {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      },
      orderId: String,
      note: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
