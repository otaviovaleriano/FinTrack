import React, { useState } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const AddExpense = ({ onAdd }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      alert("Please fill in all required fields.");
      return;
    }

    const newExpense = {
      ...form,
      id: Date.now(),
      amount: parseFloat(form.amount),
    };

    onAdd(newExpense);
    setForm({ title: "", amount: "", category: "", date: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold">{t("addTransaction.addnewexpense")}</h2>

      <div>
        <label className="block text-sm font-medium">{t("addTransaction.title")}</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
          placeholder="e.g. Grocery shopping"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">{t("addTransaction.amount")} ($)</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">{t("addTransaction.category")}</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
          placeholder="e.g. Food, Transport"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">{t("addTransaction.date")}</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {t("addTransaction.addexpense")}
      </button>
    </form>
  );
};

export default AddExpense;
