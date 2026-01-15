import { ExpenseCategory, CATEGORIES } from '@/types/expense';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  selectedMonth: string;
  selectedCategory: ExpenseCategory | 'all';
  onMonthChange: (month: string) => void;
  onCategoryChange: (category: ExpenseCategory | 'all') => void;
}

export function FilterBar({
  selectedMonth,
  selectedCategory,
  onMonthChange,
  onCategoryChange,
}: FilterBarProps) {
  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: date.toISOString().slice(0, 7),
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[180px] bg-secondary border-border/50">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border/50">
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            'filter-chip',
            selectedCategory === 'all' && 'active'
          )}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'filter-chip',
              selectedCategory === category && 'active'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
