
import { toast } from "sonner";

// In a real application, this would be connected to a backend auth service
export interface User {
  id: string;
  name: string;
  email: string;
  farmName: string;
}

let currentUser: User | null = null;

// Mock login function
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // Simple validation
      if (email && password && password.length >= 6) {
        const user: User = {
          id: "1",
          name: "John Farmer",
          email: email,
          farmName: "Green Acres Farm"
        };
        
        // Store user in localStorage in a real app
        currentUser = user;
        localStorage.setItem("farmLedger_user", JSON.stringify(user));
        toast.success("Login successful!");
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  if (currentUser) return true;
  
  // Check localStorage
  const userStr = localStorage.getItem("farmLedger_user");
  if (userStr) {
    try {
      currentUser = JSON.parse(userStr);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  return false;
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  // Check localStorage
  const userStr = localStorage.getItem("farmLedger_user");
  if (userStr) {
    try {
      currentUser = JSON.parse(userStr);
      return currentUser;
    } catch (e) {
      return null;
    }
  }
  
  return null;
};

// Logout
export const logout = (): void => {
  currentUser = null;
  localStorage.removeItem("farmLedger_user");
  toast.success("Logged out successfully");
};
