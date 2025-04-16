
import { toast } from "sonner";

// In a real application, this would be connected to a backend auth service
export interface User {
  id: string;
  name: string;
  email: string;
  farmName: string;
  role: "admin" | "user";
  permissions: string[];
}

// Mock users database
const users: User[] = [
  {
    id: "1",
    name: "John Farmer",
    email: "admin@farm.com",
    farmName: "Green Acres Farm",
    role: "admin",
    permissions: ["ledger", "dashboard", "activities", "admin"]
  }
];

let currentUser: User | null = null;

// Check if user with email exists
export const userExists = (email: string): boolean => {
  return users.some(user => user.email === email);
};

// Create new user
export const createUser = (userData: Omit<User, "id">): User => {
  const newUser = {
    ...userData,
    id: (users.length + 1).toString(),
  };
  
  users.push(newUser);
  return newUser;
};

// Get all users
export const getAllUsers = (): User[] => {
  return [...users];
};

// Update user 
export const updateUser = (userId: string, updates: Partial<Omit<User, "id">>): User | null => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates
  };
  
  // If updating current user, update local state
  if (currentUser?.id === userId) {
    currentUser = users[userIndex];
    localStorage.setItem("farmLedger_user", JSON.stringify(currentUser));
  }
  
  return users[userIndex];
};

// Delete user
export const deleteUser = (userId: string): boolean => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return false;
  
  users.splice(userIndex, 1);
  return true;
};

// Mock login function
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // Find user by email
      const user = users.find(u => u.email === email);
      
      // Simple validation
      if (user && password && password.length >= 6) {
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

// Check if user has specific permission
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user || !user.permissions) {
    return false;
  }
  return user.permissions.includes(permission);
};

// Logout
export const logout = (): void => {
  currentUser = null;
  localStorage.removeItem("farmLedger_user");
  toast.success("Logged out successfully");
};
