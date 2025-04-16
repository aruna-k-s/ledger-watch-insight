
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addExpense, ExpenseCategory } from "@/utils/data";

const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "fertilizer", label: "Fertilizers" },
  { value: "seeds", label: "Seeds" },
  { value: "labor", label: "Labor Charges" },
  { value: "fuel", label: "Fuel" },
  { value: "equipment", label: "Equipment" },
  { value: "irrigation", label: "Irrigation" },
  { value: "pesticides", label: "Pesticides" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

const formSchema = z.object({
  date: z.date(),
  category: z.enum(["fertilizer", "seeds", "labor", "fuel", "equipment", "irrigation", "pesticides", "miscellaneous"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  isPaid: z.boolean().default(true),
  dueDate: z.date().optional(),
  details: z.object({
    quantity: z.string().optional(),
    supplier: z.string().optional(),
    notes: z.string().optional(),
    laborCount: z.coerce.number().optional(),
    laborRate: z.coerce.number().optional(),
    laborHours: z.coerce.number().optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddExpenseFormProps {
  onAddSuccess?: () => void;
}

export default function AddExpenseForm({ onAddSuccess }: AddExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      category: "fertilizer",
      amount: 0,
      description: "",
      isPaid: true,
      details: {
        quantity: "",
        supplier: "",
        notes: "",
        laborCount: 0,
        laborRate: 0,
        laborHours: 0,
      },
    },
  });

  const watchCategory = form.watch("category");
  const watchIsPaid = form.watch("isPaid");
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // For labor category, we'll pass the labor details directly without nesting
      let details = data.details;
      if (data.category === "labor" && data.details) {
        details = {
          ...data.details,
          // We're not creating a nested laborers object anymore
          // Just passing the labor fields directly
          laborCount: data.details.laborCount || 0,
          laborRate: data.details.laborRate || 0,
          laborHours: data.details.laborHours || 0,
        };
      }
      
      // Submit expense
      await addExpense({
        date: data.date,
        category: data.category,
        amount: data.amount,
        description: data.description,
        isPaid: data.isPaid,
        dueDate: !data.isPaid ? data.dueDate : undefined,
        details,
      });
      
      // Reset form
      form.reset({
        date: new Date(),
        category: "fertilizer",
        amount: 0,
        description: "",
        isPaid: true,
        details: {
          quantity: "",
          supplier: "",
          notes: "",
          laborCount: 0,
          laborRate: 0,
          laborHours: 0,
        },
      });
      
      // Notify parent
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Payment Status</FormLabel>
                    <FormDescription>
                      Mark if this expense has been paid
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!watchIsPaid && (
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a due date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          defaultMonth={field.value || new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Labor-specific fields */}
            {watchCategory === "labor" && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium text-sm mb-2">Labor Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="details.laborCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Laborers</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.valueAsNumber;
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="details.laborRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate per Laborer (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.valueAsNumber;
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="details.laborHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours Worked</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.valueAsNumber;
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* General details fields */}
            {(watchCategory === "fertilizer" || watchCategory === "seeds" || watchCategory === "fuel" || watchCategory === "pesticides") && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-medium text-sm mb-2">Additional Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="details.quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 50kg, 20L" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="details.supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="Supplier name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="details.notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional details about this expense" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Expense"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
