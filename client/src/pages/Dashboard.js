import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import TotalSpentCard from "../components/dashboard/TotalSpentCard";
import GoalProgressCard from "../components/dashboard/GoalProgressCard";
import SpendingByCategoryChart from "../components/dashboard/SpendingByCategoryChart";
import IncomeSourceChart from "../components/dashboard/IncomeSourceChart";
import { getExpenses, fetchSavingsGoal } from "../api";
import { useUser } from "../UserContext";

const Dashboard = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const txData = await getExpenses(token);
        const withId = txData.map((t) => ({ ...t, id: t._id }));
        setTransactions(withId);

        const goalData = await fetchSavingsGoal(token);
        setGoal(goalData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const spentByCategory = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {})
  ).map(([name, amount]) => ({ name, amount }));

  const incomeSources = Object.entries(
    transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {})
  ).map(([name, amount]) => ({ name, amount }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalSpentCard total={totalSpent.toFixed(2)} />
        <GoalProgressCard
          totalSpent={totalSpent.toFixed(2)}
          savingGoal={goal ? goal.amount : 0}
        />
      </div>

      <Tabs defaultValue="spending" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <SpendingByCategoryChart data={spentByCategory} />
        </TabsContent>

        <TabsContent value="income">
          <IncomeSourceChart data={incomeSources} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
