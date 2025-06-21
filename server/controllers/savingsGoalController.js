import SavingsGoal from "../models/SavingsGoal.js";

export const getSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({ user: req.user._id });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goal" });
  }
};

export const saveOrUpdateSavingsGoal = async (req, res) => {
  try {
    const { amount, startDate, endDate } = req.body;

    if (isNaN(amount) || !startDate || !endDate) {
      return res.status(400).json({ message: "Invalid goal data" });
    }

    const updated = await SavingsGoal.findOneAndUpdate(
      { user: req.user._id },
      { amount, startDate, endDate },
      { upsert: true, new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to save goal" });
  }
};

export const clearSavingsGoal = async (req, res) => {
  try {
    await SavingsGoal.deleteOne({ user: req.user._id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Failed to clear goal" });
  }
};
