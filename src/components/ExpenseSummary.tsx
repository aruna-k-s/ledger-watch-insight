
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getExpenseSummaryByCategory, getFinanceSummary } from "@/utils/data";
import { ChartPie, IndianRupee } from "lucide-react";

const ExpenseSummary: React.FC = () => {
  const categorySummary = getExpenseSummaryByCategory();
  const finance = getFinanceSummary();
  
  // Transform data for chart
  const chartData = Object.entries(categorySummary)
    .filter(([_, value]) => value > 0)
    .map(([category, amount]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount
    }))
    .sort((a, b) => b.amount - a.amount);

  const colors = [
    "#65A30D", // green (farm-green)
    "#92400E", // brown (farm-brown)
    "#4D7C0F", // dark green
    "#713F12", // dark brown
    "#86EFAC", // light green
    "#D8B4FE", // light brown (placeholder)
    "#f97316", // orange
    "#0ea5e9", // blue
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <ChartPie className="h-5 w-5 text-farm-green" />
          Expense Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="col-span-2 md:col-span-2">
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-muted-foreground">Total Investment</span>
                <span className="text-xl font-bold flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {finance.totalInvestment.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-muted-foreground">Total Expenses</span>
                <span className="text-xl font-bold flex items-center text-destructive">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {finance.totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-muted-foreground">Balance</span>
                <span className="text-xl font-bold flex items-center text-farm-green">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {finance.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[240px] mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    tick={{ fontSize: 10 }}
                    height={70}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="amount" maxBarSize={50}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No expense data available</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
