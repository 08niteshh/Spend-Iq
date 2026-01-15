import { useState } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { CategoryBadge } from '@/components/dashboard/CategoryBadge';
import { ExpenseForm } from './ExpenseForm';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ExpenseTableProps {
  expenses: Expense[];
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onUpdate, onDelete }: ExpenseTableProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleUpdate = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      onUpdate(editingExpense.id, data);
      setEditingExpense(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-4xl">📭</div>
        <h3 className="text-lg font-medium">No expenses yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first expense to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="text-right">Amount</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              key={expense.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="text-muted-foreground">
                {formatDate(expense.date)}
              </td>
              <td className="font-medium">
                {expense.description || 'No description'}
              </td>
              <td>
                <CategoryBadge category={expense.category} />
              </td>
              <td className="text-right font-mono font-semibold">
                ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <ExpenseForm
                    initialData={expense}
                    onSubmit={handleUpdate}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingExpense(expense)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border/50">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete expense?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete
                          this expense from your records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border/50">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(expense.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
