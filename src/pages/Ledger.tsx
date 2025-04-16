
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isLoggedIn } from "@/utils/auth";
import NavBar from "@/components/NavBar";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { toast } from "sonner";
import { getFinanceSummary, updateTotalInvestment } from "@/utils/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

const Ledger: React.FC = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [finance, setFinance] = useState(getFinanceSummary());
  const [newInvestment, setNewInvestment] = useState(finance.totalInvestment);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Refresh finance data when refreshTrigger changes
    setFinance(getFinanceSummary());
  }, [refreshTrigger]);

  const handleAddSuccess = () => {
    // Trigger refresh of expense list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateInvestment = async () => {
    setIsUpdating(true);
    try {
      await updateTotalInvestment(newInvestment);
      setFinance(getFinanceSummary());
      toast.success("Total investment updated successfully!");
    } catch (error) {
      console.error("Failed to update investment:", error);
      toast.error("Failed to update investment");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Farm Ledger</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Investment summary */}
          <div className="lg:col-span-4">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Farm Investment Summary</h2>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Total Investment</label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="number"
                        value={newInvestment}
                        onChange={(e) => setNewInvestment(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      onClick={handleUpdateInvestment}
                      disabled={isUpdating || newInvestment === finance.totalInvestment}
                      className="ml-2"
                    >
                      Update
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">Total Expenses</span>
                  <span className="text-xl font-bold text-destructive">₹{finance.totalExpenses.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">Balance</span>
                  <span className="text-xl font-bold text-farm-green">₹{finance.balance.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">Expense Ratio</span>
                  <span className="text-xl font-bold">
                    {finance.totalInvestment > 0 
                      ? ((finance.totalExpenses / finance.totalInvestment) * 100).toFixed(1) 
                      : "0"}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for expense management */}
          <div className="lg:col-span-4">
            <Tabs defaultValue="records">
              <TabsList className="mb-4">
                <TabsTrigger value="records">Expense Records</TabsTrigger>
                <TabsTrigger value="add">Add New Expense</TabsTrigger>
              </TabsList>
              <TabsContent value="records" className="mt-0">
                <ExpenseList />
              </TabsContent>
              <TabsContent value="add" className="mt-0">
                <div className="max-w-2xl mx-auto">
                  <AddExpenseForm onAddSuccess={handleAddSuccess} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ledger;
