
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUnpaidExpenses, updateExpense, Expense } from "@/utils/data";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const PaymentReminder: React.FC = () => {
  const unpaidExpenses = getUnpaidExpenses();
  const [processing, setProcessing] = React.useState(false);
  const [localExpenses, setLocalExpenses] = React.useState<Expense[]>(unpaidExpenses);

  const handleMarkAsPaid = async (id: string) => {
    setProcessing(true);
    try {
      await updateExpense(id, { isPaid: true });
      // Update local state
      setLocalExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Payment Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {localExpenses.length > 0 ? (
          <div className="space-y-3">
            {localExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{expense.description}</p>
                  <div className="text-xs text-muted-foreground flex gap-1 items-center">
                    <span>₹{expense.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>Due: {format(new Date(expense.dueDate!), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleMarkAsPaid(expense.id)}
                  disabled={processing}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Mark Paid
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-sm">
            <p className="text-muted-foreground">No pending payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentReminder;
