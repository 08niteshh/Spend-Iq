export type ExpenseCategory = 'Food' | 'Travel' | 'Bills' | 'Shopping' | 'Health' | 'Others';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
  month: string; // YYYY-MM format
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  budget?: number;
  isOverBudget: boolean;
}

export interface MonthlyStats {
  month: string;
  totalSpending: number;
  categoryBreakdown: CategorySummary[];
  highestCategory: ExpenseCategory;
  savingsRatio: number;
  budgetVsActual: number;
}

export interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  message: string;
  icon: string;
}

export const CATEGORIES: ExpenseCategory[] = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Others'];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: 'hsl(38, 92%, 50%)',
  Travel: 'hsl(217, 91%, 60%)',
  Bills: 'hsl(0, 72%, 51%)',
  Shopping: 'hsl(280, 65%, 60%)',
  Health: 'hsl(160, 84%, 39%)',
  Others: 'hsl(222, 20%, 50%)',
};

export const CATEGORY_BG_COLORS: Record<ExpenseCategory, string> = {
  Food: 'bg-category-food/10 text-category-food border-category-food/20',
  Travel: 'bg-category-travel/10 text-category-travel border-category-travel/20',
  Bills: 'bg-category-bills/10 text-category-bills border-category-bills/20',
  Shopping: 'bg-category-shopping/10 text-category-shopping border-category-shopping/20',
  Health: 'bg-category-health/10 text-category-health border-category-health/20',
  Others: 'bg-category-others/10 text-category-others border-category-others/20',
};
