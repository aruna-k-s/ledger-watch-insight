
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExpenses, Expense } from "@/utils/data";
import { format } from "date-fns";
import { ArrowUpCircle, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const RecentActivities: React.FC = () => {
  // Using useQuery to fetch and cache expenses data
  const { data: allExpenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => getExpenses(),
  });
  
  // Get 5 most recent expenses
  const expenses = allExpenses ? allExpenses.slice(0, 5) : [];

  const getCategoryIcon = (category: string) => {
    const iconClassName = "h-8 w-8 p-1 rounded-full";
    
    switch (category) {
      case "fertilizer":
        return <div className={`${iconClassName} bg-green-100 text-green-600`}>🌱</div>;
      case "seeds":
        return <div className={`${iconClassName} bg-amber-100 text-amber-600`}>🌾</div>;
      case "labor":
        return <div className={`${iconClassName} bg-blue-100 text-blue-600`}>👨‍🌾</div>;
      case "fuel":
        return <div className={`${iconClassName} bg-red-100 text-red-600`}>⛽</div>;
      case "equipment":
        return <div className={`${iconClassName} bg-purple-100 text-purple-600`}>🚜</div>;
      case "irrigation":
        return <div className={`${iconClassName} bg-cyan-100 text-cyan-600`}>💧</div>;
      case "pesticides":
        return <div className={`${iconClassName} bg-rose-100 text-rose-600`}>🐞</div>;
      default:
        return <div className={`${iconClassName} bg-gray-100 text-gray-600`}>📦</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-farm-green" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : expenses.length > 0 ? (
            expenses.map((expense: Expense) => (
              <div key={expense.id} className="flex items-start gap-3">
                {getCategoryIcon(expense.category)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="font-semibold text-sm">₹{expense.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <p className="capitalize">{expense.category}</p>
                    <span>•</span>
                    <p>{format(expense.date, "MMM d, yyyy")}</p>
                  </div>
                  {!expense.isPaid && expense.dueDate && (
                    <div className="flex items-center text-xs text-amber-600 font-medium">
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: {format(expense.dueDate, "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No recent activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
