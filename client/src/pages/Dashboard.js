import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import TotalSpentCard from "../components/dashboard/TotalSpentCard";
import GoalProgressCard from "../components/dashboard/GoalProgressCard";
import SpendingByCategoryChart from "../components/dashboard/SpendingByCategoryChart";
import IncomeSourceChart from "../components/dashboard/IncomeSourceChart";

const Dashboard = () => {
  const totalSpent = 640;
  const savingGoal = 1000;

  const spentByCategory = [
    { name: "Groceries", amount: 220 },
    { name: "Leisure", amount: 150 },
    { name: "Bills", amount: 270 },
  ];

  const incomeSources = [
    { name: "Current Work", amount: 950 },
    { name: "Others", amount: 250 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalSpentCard total={totalSpent} />
        <GoalProgressCard totalSpent={totalSpent} savingGoal={savingGoal} />
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
