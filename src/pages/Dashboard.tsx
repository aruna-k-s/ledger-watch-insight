
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/utils/auth";
import NavBar from "@/components/NavBar";
import RecentActivities from "@/components/RecentActivities";
import ExpenseSummary from "@/components/ExpenseSummary";
import PaymentReminder from "@/components/PaymentReminder";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

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
