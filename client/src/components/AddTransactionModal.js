import React, { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const AddTransactionModal = ({ isOpen, onClose, onAdd, defaultData }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    description: "",
    amount: "",
    date: "",
  });

  const expenseCategories = [
    t("addTransaction.grocery"),
    t("addTransaction.leisure"),
    t("addTransaction.bills"),
    t("addTransaction.work"),
  ];
  const incomeCategories = [t("addTransaction.currentWork"), t("addTransaction.others")];

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

    console.log("Transaction submitted:", transaction);

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
          {defaultData ? t("addTransaction.edit") : t("addTransaction.add")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium">{t("addTransaction.type")}</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="expense">{t("addTransaction.expense")}</option>
              <option value="income">{t("addTransaction.income")}</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">{t("addTransaction.category")}</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">{t("addTransaction.selectCategory")}</option>
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
            <label className="block text-sm font-medium">{t("addTransaction.description")}</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder={
                form.type === "income"
                  ? t("addTransaction.exampleIncome")
                  : t("addTransaction.exampleExpense")
              }
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium">{t("addTransaction.amount")}</label>
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
            <label className="block text-sm font-medium">{t("addTransaction.date")}</label>
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
