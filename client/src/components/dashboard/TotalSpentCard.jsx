import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const TotalSpentCard = ({ total }) => (
  <Card>
    <CardHeader>
      <CardTitle>Total Spent</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-red-500">${total}</p>
    </CardContent>
  </Card>
);

export default TotalSpentCard;
