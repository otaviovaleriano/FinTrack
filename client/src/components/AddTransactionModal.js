import React, { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api";

const AddTransactionModal = ({ isOpen, onClose, onAdd, defaultData }) => {
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    description: "",
    amount: "",
    date: "",
  });

  const expenseCategories = [
    "Groceries",
    "Leisure Activities",
    "House Bills",
    "Work",
  ];
  const incomeCategories = ["Current Work", "Others"];

  useEffect(() => {
    if (defaultData) {
      setForm(defaultData);
    } else {
      setForm({
        type: "expense",
        category: "",
        description: "",
        amount: "",
        date: "",
      });
    }
  }, [defaultData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.amount || !form.date || !form.category) {
      alert("Please fill in all fields.");
      return;
    }

    const transaction = {
      ...form,
      amount: parseFloat(form.amount),
    };

    console.log("Transaction being submitted:", transaction);

    try {
      const token = localStorage.getItem("token");

      let saved;
      if (defaultData && defaultData._id) {
        //editing
        saved = await updateExpense(defaultData._id, transaction, token);
      } else {
        // adding new
        saved = await addExpense(transaction, token);
      }

      onAdd(saved);
      onClose();

      if (!defaultData) {
        setForm({
          type: "expense",
          category: "",
          description: "",
          amount: "",
          date: "",
        });
      }
    } catch (err) {
      console.error("Error saving transaction:", err);
      alert("Failed to save transaction.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">
          {defaultData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select category</option>
              {(form.type === "expense"
                ? expenseCategories
                : incomeCategories
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder={
                form.type === "income"
                  ? "e.g. Freelance payment"
                  : "e.g. Electricity bill"
              }
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {defaultData ? "Update Transaction" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
