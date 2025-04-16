
import { toast } from "sonner";

export type ExpenseCategory = 
  | "fertilizer" 
  | "seeds" 
  | "labor" 
  | "fuel" 
  | "equipment" 
  | "irrigation" 
  | "pesticides" 
  | "miscellaneous";

export interface Expense {
  id: string;
  date: Date;
  category: ExpenseCategory;
  amount: number;
  description: string;
  isPaid: boolean;
  dueDate?: Date;
  details?: Record<string, any>;
}

export interface Labor {
  count: number;
  rate: number;
  hours: number;
}

export interface FarmFinance {
  totalInvestment: number;
  totalExpenses: number;
  balance: number;
}

// Mock data
let mockExpenses: Expense[] = [
  {
    id: "1",
    date: new Date(2025, 3, 10),
    category: "fertilizer",
    amount: 2500,
    description: "NPK Fertilizer purchase",
    isPaid: true,
    details: {
      quantity: "50kg",
      supplier: "AgriSupply Co."
    }
  },
  {
    id: "2",
    date: new Date(2025, 3, 12),
    category: "seeds",
    amount: 1800,
    description: "Corn seeds for spring planting",
    isPaid: true,
    details: {
      quantity: "25kg",
      variety: "Sweet Corn"
    }
  },
  {
    id: "3",
    date: new Date(2025, 3, 15),
    category: "labor",
    amount: 3000,
    description: "Field preparation labor",
    isPaid: true,
    details: {
      laborers: {
        count: 5,
        rate: 600,
        hours: 8
      }
    }
  },
  {
    id: "4",
    date: new Date(2025, 4, 5),
    category: "fuel",
    amount: 1200,
    description: "Tractor fuel for planting",
    isPaid: false,
    dueDate: new Date(2025, 4, 20),
    details: {
      quantity: "40L",
      vehicle: "John Deere Tractor"
    }
  },
  {
    id: "5",
    date: new Date(2025, 4, 8),
    category: "equipment",
    amount: 5000,
    description: "Irrigation equipment maintenance",
    isPaid: false,
    dueDate: new Date(2025, 4, 25),
    details: {
      contractor: "Farm Equipment Repairs"
    }
  }
];

let mockFinance: FarmFinance = {
  totalInvestment: 100000,
  totalExpenses: 13500,
  balance: 86500
};

// Get all expenses
export const getExpenses = (): Expense[] => {
  return [...mockExpenses].sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Get expenses by category
export const getExpensesByCategory = (category: ExpenseCategory): Expense[] => {
  return getExpenses().filter(expense => expense.category === category);
};

// Get unpaid expenses
export const getUnpaidExpenses = (): Expense[] => {
  return getExpenses().filter(expense => !expense.isPaid);
};

// Add new expense
export const addExpense = (expense: Omit<Expense, "id">): Promise<Expense> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newExpense: Expense = {
        ...expense,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      mockExpenses.push(newExpense);
      mockFinance.totalExpenses += newExpense.amount;
      mockFinance.balance = mockFinance.totalInvestment - mockFinance.totalExpenses;
      
      toast.success("Expense added successfully!");
      resolve(newExpense);
    }, 500);
  });
};

// Update expense
export const updateExpense = (id: string, updates: Partial<Expense>): Promise<Expense> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockExpenses.findIndex(e => e.id === id);
      
      if (index === -1) {
        reject(new Error("Expense not found"));
        return;
      }
      
      // If amount is being updated, adjust finances
      if (updates.amount !== undefined && updates.amount !== mockExpenses[index].amount) {
        const difference = updates.amount - mockExpenses[index].amount;
        mockFinance.totalExpenses += difference;
        mockFinance.balance = mockFinance.totalInvestment - mockFinance.totalExpenses;
      }
      
      mockExpenses[index] = { ...mockExpenses[index], ...updates };
      
      toast.success("Expense updated successfully!");
      resolve(mockExpenses[index]);
    }, 500);
  });
};

// Delete expense
export const deleteExpense = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockExpenses.findIndex(e => e.id === id);
      
      if (index === -1) {
        reject(new Error("Expense not found"));
        return;
      }
      
      // Adjust finances
      mockFinance.totalExpenses -= mockExpenses[index].amount;
      mockFinance.balance = mockFinance.totalInvestment - mockFinance.totalExpenses;
      
      mockExpenses = mockExpenses.filter(e => e.id !== id);
      
      toast.success("Expense deleted successfully!");
      resolve();
    }, 500);
  });
};

// Get finance summary
export const getFinanceSummary = (): FarmFinance => {
  return { ...mockFinance };
};

// Update total investment
export const updateTotalInvestment = (amount: number): Promise<FarmFinance> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockFinance.totalInvestment = amount;
      mockFinance.balance = mockFinance.totalInvestment - mockFinance.totalExpenses;
      
      toast.success("Investment updated successfully!");
      resolve({ ...mockFinance });
    }, 500);
  });
};

// Get expenses by category summary
export const getExpenseSummaryByCategory = (): Record<ExpenseCategory, number> => {
  const categories: ExpenseCategory[] = ["fertilizer", "seeds", "labor", "fuel", "equipment", "irrigation", "pesticides", "miscellaneous"];
  const summary = {} as Record<ExpenseCategory, number>;
  
  categories.forEach(category => {
    summary[category] = mockExpenses
      .filter(e => e.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });
  
  return summary;
};
