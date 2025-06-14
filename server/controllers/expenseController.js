import Expense from "../models/Expense.js";

export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { type, category, description, amount, date } = req.body;
    if (
      typeof type !== "string" ||
      !["income", "expense"].includes(type) ||
      typeof category !== "string" ||
      typeof description !== "string" ||
      typeof date !== "string" ||
      isNaN(parseFloat(amount))
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const newExpense = new Expense({
      type,
      category,
      description,
      amount: parseFloat(amount),
      date,
      user: req.user._id,
    });
    console.log(req.body);

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
