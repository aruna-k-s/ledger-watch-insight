import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, hasPermission } from "@/utils/auth";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import RecentActivities from "@/components/RecentActivities";
import ExpenseSummary from "@/components/ExpenseSummary";
import PaymentReminder from "@/components/PaymentReminder";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Redirect if not logged in or doesn't have permission
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!hasPermission("dashboard")) {
      toast.error("You don't have permission to access the dashboard");
      navigate("/ledger");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    // Refresh expenses data when dashboard is loaded
    queryClient.invalidateQueries({ queryKey: ['expenses'] });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left column - Recent Activities */}
          <div className="md:col-span-1 space-y-6">
            <RecentActivities />
            <PaymentReminder />
          </div>
          
          {/* Right column - Expense Summary */}
          <div className="md:col-span-2">
            <ExpenseSummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
