import { ExpenseCategory, CATEGORY_BG_COLORS } from '@/types/expense';
import { cn } from '@/lib/utils';
import { 
  Utensils, 
  Plane, 
  Receipt, 
  ShoppingBag, 
  Heart, 
  MoreHorizontal 
} from 'lucide-react';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
  Food: Utensils,
  Travel: Plane,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Health: Heart,
  Others: MoreHorizontal,
};

export function CategoryBadge({ category, showIcon = true, size = 'sm' }: CategoryBadgeProps) {
  const Icon = categoryIcons[category];
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'category-badge inline-flex items-center gap-1.5 rounded-full border font-medium',
        CATEGORY_BG_COLORS[category],
        sizeStyles[size]
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {category}
    </span>
  );
}
