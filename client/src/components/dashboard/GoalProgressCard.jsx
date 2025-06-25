import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const GoalProgressCard = ({ totalSpent, savingGoal }) => {
  if (!savingGoal || savingGoal === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saving Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No Saving Goal Set</p>
        </CardContent>
      </Card>
    );
  }

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
