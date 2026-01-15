import { CategorySummary, CATEGORY_COLORS } from '@/types/expense';
import { cn } from '@/lib/utils';

interface BudgetProgressProps {
  data: CategorySummary[];
}

export function BudgetProgress({ data }: BudgetProgressProps) {
  const categoriesWithBudget = data.filter(d => d.budget && d.budget > 0);

  return (
    <div className="chart-container">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Budget vs Actual
      </h3>
      <div className="space-y-4">
        {categoriesWithBudget.map(cat => {
          const percentage = cat.budget ? Math.min((cat.total / cat.budget) * 100, 100) : 0;
          const overflow = cat.budget && cat.total > cat.budget ? ((cat.total - cat.budget) / cat.budget) * 100 : 0;

          return (
            <div key={cat.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{cat.category}</span>
                <span className={cn(
                  'font-mono text-xs',
                  cat.isOverBudget ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  ₹{cat.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹{cat.budget?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    'absolute left-0 top-0 h-full rounded-full transition-all duration-500',
                    cat.isOverBudget ? 'bg-destructive' : ''
                  )}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: cat.isOverBudget ? undefined : CATEGORY_COLORS[cat.category],
                  }}
                />
                {overflow > 0 && (
                  <div
                    className="absolute right-0 top-0 h-full animate-pulse-subtle rounded-r-full bg-destructive/50"
                    style={{ width: `${Math.min(overflow, 30)}%` }}
                  />
                )}
              </div>
              {cat.isOverBudget && (
                <p className="text-xs text-destructive">
                  Over budget by ₹{(cat.total - (cat.budget || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
