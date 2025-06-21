import React, { useState, useEffect } from "react";
import AddTransactionModal from "../components/AddTransactionModal";
import SummaryCards from "../components/SummaryCards";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { isAfter, isBefore, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { getExpenses, deleteExpense } from "../api";
import { useUser } from "../UserContext";
import {
  fetchSavingsGoal,
  saveSavingsGoal,
  clearSavingsGoal as clearGoalAPI,
} from "../api";
import SetGoalModal from "../components/SetGoalModal";

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [goal, setGoal] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const { user } = useUser();

  // ✅ Move this to the top-level so it’s usable everywhere
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getExpenses(token);
      const withId = data.map((exp) => ({
        ...exp,
        id: exp._id,
      }));
      setTransactions(withId);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  useEffect(() => {
    if (startDate)
      localStorage.setItem("filterStartDate", startDate.toISOString());
    else localStorage.removeItem("filterStartDate");

    if (endDate) localStorage.setItem("filterEndDate", endDate.toISOString());
    else localStorage.removeItem("filterEndDate");
  }, [startDate, endDate]);

  const handleAddOrUpdateTransaction = (savedTx) => {
    const newTx = {
      ...savedTx,
      id: savedTx._id,
    };

    setTransactions((prev) => {
      const index = prev.findIndex((tx) => tx._id === newTx._id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newTx;
        return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        return [newTx, ...prev].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }
    });

    setEditTarget(null);
  };

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = localStorage.getItem("token");
        const goalData = await fetchSavingsGoal(token);
        setGoal(goalData);
      } catch (err) {
        console.error("Failed to load goal:", err);
      }
    };

    if (user) {
      fetchGoal();
    }
  }, [user]);

  const handleEdit = (tx) => {
    setEditTarget(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteExpense(id, token);
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Error deleting transaction.");
      }
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = parseISO(tx.date);
    if (startDate && isBefore(txDate, startDate)) return false;
    if (endDate && isAfter(txDate, endDate)) return false;
    return true;
  });

  const handleGoalEdit = () => {
    setIsGoalModalOpen(true);
  };

  const handleGoalClear = async () => {
    if (window.confirm("Are you sure you want to clear your savings goal?")) {
      try {
        const token = localStorage.getItem("token");
        await clearGoalAPI(token);
        setGoal(null);
      } catch (err) {
        console.error("Error clearing goal:", err);
        alert("Failed to clear goal.");
      }
    }
  };

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

      <SetGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={async (newGoal) => {
          try {
            const token = localStorage.getItem("token");
            const saved = await saveSavingsGoal(newGoal, token);
            setGoal(saved);
          } catch (err) {
            console.error("Error saving goal:", err);
            alert("Failed to save goal.");
          }
        }}
        initialGoal={goal}
      />

      <SummaryCards
        transactions={filteredTransactions}
        goalAmount={goal}
        handleGoalEdit={handleGoalEdit}
        handleGoalClear={handleGoalClear}
      />

      {/* Date Filters */}
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
                <li
                  key={tx.id}
                  className="py-3 flex justify-between items-center"
                >
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
