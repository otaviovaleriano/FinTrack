import React, { useState, useEffect } from "react";
import AddTransactionModal from "../components/AddTransactionModal";
import SummaryCards from "../components/SummaryCards";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { isAfter, isBefore, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    const savedStart = localStorage.getItem("filterStartDate");
    const savedEnd = localStorage.getItem("filterEndDate");

    if (saved) setTransactions(JSON.parse(saved));
    if (savedStart) setStartDate(new Date(savedStart));
    if (savedEnd) setEndDate(new Date(savedEnd));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (startDate) localStorage.setItem("filterStartDate", startDate.toISOString());
    else localStorage.removeItem("filterStartDate");

    if (endDate) localStorage.setItem("filterEndDate", endDate.toISOString());
    else localStorage.removeItem("filterEndDate");
  }, [startDate, endDate]);

  const handleAddOrUpdateTransaction = (tx) => {
    if (editTarget) {
      setTransactions((prev) =>
        prev.map((item) => (item.id === editTarget.id ? { ...tx, id: item.id } : item))
      );
      setEditTarget(null);
    } else {
      setTransactions((prev) => [tx, ...prev]);
    }
  };

  const handleEdit = (tx) => {
    setEditTarget(tx);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = parseISO(tx.date);
    if (startDate && isBefore(txDate, startDate)) return false;
    if (endDate && isAfter(txDate, endDate)) return false;
    return true;
  });

  return (
    <div className="relative min-h-screen bg-gray-100 px-4 py-8">
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTarget(null);
        }}
        onAdd={handleAddOrUpdateTransaction}
        defaultData={editTarget}
      />

      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditTarget(null);
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-40"
      >
        + Add Transaction
      </button>

      <SummaryCards transactions={filteredTransactions} />

      {/* Date Range Filters */}
      <div className="max-w-2xl mx-auto mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Date Range:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Start Date</span>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border px-3 py-2 rounded"
              placeholderText="Start date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-600">End Date</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border px-3 py-2 rounded"
              placeholderText="End date"
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <ul className="divide-y">
              {filteredTransactions.map((tx) => (
                <li key={tx.id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    <div className="text-sm text-gray-500">
                      {tx.category} — {tx.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`font-semibold ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleEdit(tx)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
