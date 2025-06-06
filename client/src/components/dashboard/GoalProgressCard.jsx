import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const GoalProgressCard = ({ totalSpent, savingGoal }) => {
  const percent = Math.min((totalSpent / savingGoal) * 100, 100);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Saving Goal</CardTitle>
        <Badge variant={percent >= 100 ? "destructive" : "default"}>
          {percent >= 100 ? "Goal Exceeded" : "On Track"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ${totalSpent} of ${savingGoal} spent
        </p>
      </CardContent>
    </Card>
  );
};

export default GoalProgressCard;
