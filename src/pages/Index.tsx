
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/utils/auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if logged in, otherwise to login page
    if (isLoggedIn()) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // This is just a fallback while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 farm-pattern">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-farm-green mb-4">Farm Ledger</h1>
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
