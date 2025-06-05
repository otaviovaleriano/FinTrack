import React from "react";

const SummaryCards = ({ transactions }) => {
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = incomeTotal - expenseTotal;

  const cardStyle = "bg-white p-6 rounded shadow-md flex-1";

  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto mb-8">
      <div className={cardStyle}>
        <h3 className="text-sm text-gray-500">Current Balance</h3>
        <p className="text-2xl font-bold text-blue-600">${balance.toFixed(2)}</p>
      </div>
      <div className={cardStyle}>
        <h3 className="text-sm text-gray-500">Amount Spent</h3>
        <p className="text-2xl font-bold text-red-500">${expenseTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
