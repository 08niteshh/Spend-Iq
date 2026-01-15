import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExpenseCategory, CATEGORIES, Budget, CategorySummary } from '@/types/expense';
import { Settings2 } from 'lucide-react';
import { CategoryBadge } from '@/components/dashboard/CategoryBadge';
import { cn } from '@/lib/utils';

interface BudgetManagerProps {
  budgets: Budget[];
  categoryData: CategorySummary[];
  currentMonth: string;
  onUpdateBudget: (category: ExpenseCategory, limit: number, month: string) => void;
}

export function BudgetManager({
  budgets,
  categoryData,
  currentMonth,
  onUpdateBudget,
}: BudgetManagerProps) {
  const [open, setOpen] = useState(false);
  const [localBudgets, setLocalBudgets] = useState<Record<ExpenseCategory, string>>(() => {
    const initial: Record<ExpenseCategory, string> = {} as any;
    CATEGORIES.forEach(cat => {
      const budget = budgets.find(b => b.category === cat && b.month === currentMonth);
      initial[cat] = budget?.limit?.toString() || '';
    });
    return initial;
  });

  const handleSave = () => {
    CATEGORIES.forEach(cat => {
      const value = parseFloat(localBudgets[cat] || '0');
      if (value > 0) {
        onUpdateBudget(cat, value, currentMonth);
      }
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-border/50">
          <Settings2 className="h-4 w-4" />
          Manage Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Budget Settings</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set monthly spending limits for each category
          </p>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {CATEGORIES.map((category) => {
            const catData = categoryData.find(c => c.category === category);
            const spent = catData?.total || 0;
            const budget = parseFloat(localBudgets[category] || '0');
            const isOverBudget = budget > 0 && spent > budget;

            return (
              <div key={category} className="flex items-center gap-4">
                <div className="w-28">
                  <CategoryBadge category={category} size="md" />
                </div>
                <div className="flex-1">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={localBudgets[category]}
                      onChange={(e) =>
                        setLocalBudgets({ ...localBudgets, [category]: e.target.value })
                      }
                      className={cn(
                        'pl-8 font-mono bg-secondary border-border/50',
                        isOverBudget && 'border-destructive/50'
                      )}
                    />
                  </div>
                </div>
                <div className="w-28 text-right">
                  <span className={cn(
                    'text-sm font-mono',
                    isOverBudget ? 'text-destructive' : 'text-muted-foreground'
                  )}>
                    ₹{spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })} spent
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            className="flex-1 border-border/50"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 btn-primary-gradient">
            <span className="relative z-10">Save Budgets</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
