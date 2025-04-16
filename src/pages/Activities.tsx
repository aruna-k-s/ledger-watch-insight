
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { CalendarIcon, Filter, ListFilter, ActivityIcon } from "lucide-react";
import { getExpenses, getUnpaidExpenses, Expense, ExpenseCategory } from "@/utils/data";
import NavBar from "@/components/NavBar";
import PaymentReminder from "@/components/PaymentReminder";
import { cn } from "@/lib/utils";

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Query for expenses
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => getExpenses(),
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setDateRange({ from: undefined, to: undefined });
  };
  
  // Apply filters to expenses
  const filteredExpenses = expenses?.filter((expense: Expense) => {
    // Search filter
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateRange.from) {
      matchesDate = isAfter(expense.date, dateRange.from) || isEqual(expense.date, dateRange.from);
    }
    if (dateRange.to && matchesDate) {
      matchesDate = isBefore(expense.date, dateRange.to) || isEqual(expense.date, dateRange.to);
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  }) || [];
  
  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "All Dates";
    if (dateRange.from && !dateRange.to) return `From ${format(dateRange.from, "MMM d, yyyy")}`;
    if (!dateRange.from && dateRange.to) return `Until ${format(dateRange.to, "MMM d, yyyy")}`;
    return `${format(dateRange.from!, "MMM d, yyyy")} - ${format(dateRange.to!, "MMM d, yyyy")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Farm Activities</h1>
        
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="activities" className="text-sm">
              Activities Log
            </TabsTrigger>
            <TabsTrigger value="reminders" className="text-sm">
              Payment Reminders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <ListFilter className="h-5 w-5 text-farm-green" />
                  Activity Filters
                </CardTitle>
                <div className="grid gap-4 mt-4 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Select 
                      value={categoryFilter} 
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="fertilizer">Fertilizers</SelectItem>
                        <SelectItem value="seeds">Seeds</SelectItem>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="fuel">Fuel</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="irrigation">Irrigation</SelectItem>
                        <SelectItem value="pesticides">Pesticides</SelectItem>
                        <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDateRange()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-3 border-t border-border flex justify-between">
                          <Button variant="ghost" size="sm" onClick={() => setDateRange({ from: undefined, to: undefined })}>
                            Clear
                          </Button>
                          <Button size="sm" onClick={() => document.body.click()}>Apply</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="md:col-span-1 flex items-start">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={resetFilters}
                      className="w-full"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-6 text-center text-muted-foreground">
                    Loading activities...
                  </div>
                ) : filteredExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredExpenses.map((expense: Expense) => (
                      <div key={expense.id} className="flex items-start gap-3 p-3 border-b last:border-0">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="font-medium">{expense.description}</p>
                            <p className="font-semibold">₹{expense.amount.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <p className="capitalize">{expense.category}</p>
                            <span>•</span>
                            <p>{format(new Date(expense.date), "MMM d, yyyy")}</p>
                          </div>
                          {!expense.isPaid && expense.dueDate && (
                            <div className="flex items-center text-xs text-amber-600 font-medium">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Due: {format(new Date(expense.dueDate), "MMM d, yyyy")}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${expense.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {expense.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                            {renderExpenseDetails(expense)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <ActivityIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">No activities found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try adjusting your filters or add some new expenses
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/ledger")}
                    >
                      Add Expense
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reminders">
            <PaymentReminder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Helper function to render category icons
const getCategoryIcon = (category: string) => {
  const iconClassName = "h-10 w-10 p-2 rounded-full";
  
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

// Helper function to render expense details
const renderExpenseDetails = (expense: Expense) => {
  if (!expense.details) return null;
  
  const details = [];
  
  if (expense.details.quantity) {
    details.push(`Quantity: ${expense.details.quantity}`);
  }
  
  if (expense.details.supplier) {
    details.push(`Supplier: ${expense.details.supplier}`);
  }
  
  if (expense.details.laborers && typeof expense.details.laborers === 'object') {
    const laborers = expense.details.laborers;
    details.push(`Laborers: ${laborers.count} × ₹${laborers.rate} × ${laborers.hours}hrs`);
  }
  
  return details.length > 0 ? (
    <span className="text-xs text-muted-foreground ml-2">
      {details.join(' • ')}
    </span>
  ) : null;
};

export default Activities;
