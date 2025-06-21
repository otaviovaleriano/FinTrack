import mongoose from "mongoose";

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: String, 
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
});

const SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);
export default SavingsGoal;
