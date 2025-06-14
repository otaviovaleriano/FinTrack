import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"], 
      required: true,
    },
    category: String,
    description: String,
    amount: Number,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
