import { useMemo } from 'react';
import { Expense, ExpenseCategory, CategorySummary, MonthlyStats, Insight, CATEGORIES, Budget } from '@/types/expense';

interface AnalyticsFilters {
  month?: string;
  year?: string;
  category?: ExpenseCategory;
}

export function useAnalytics(expenses: Expense[], budgets: Budget[], filters: AnalyticsFilters) {
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.toISOString().slice(0, 7);
      const expenseYear = expenseDate.getFullYear().toString();

      if (filters.month && expenseMonth !== filters.month) return false;
      if (filters.year && expenseYear !== filters.year) return false;
      if (filters.category && expense.category !== filters.category) return false;

      return true;
    });
  }, [expenses, filters]);

  const totalSpending = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const categoryBreakdown = useMemo((): CategorySummary[] => {
    const totals: Record<ExpenseCategory, { total: number; count: number }> = {
      Food: { total: 0, count: 0 },
      Travel: { total: 0, count: 0 },
      Bills: { total: 0, count: 0 },
      Shopping: { total: 0, count: 0 },
      Health: { total: 0, count: 0 },
      Others: { total: 0, count: 0 },
    };

    filteredExpenses.forEach(expense => {
      totals[expense.category].total += expense.amount;
      totals[expense.category].count += 1;
    });

    const month = filters.month || new Date().toISOString().slice(0, 7);

    return CATEGORIES.map(category => {
      const { total, count } = totals[category];
      const budget = budgets.find(b => b.category === category && b.month === month)?.limit;
      
      return {
        category,
        total,
        count,
        percentage: totalSpending > 0 ? (total / totalSpending) * 100 : 0,
        budget,
        isOverBudget: budget ? total > budget : false,
      };
    }).sort((a, b) => b.total - a.total);
  }, [filteredExpenses, totalSpending, budgets, filters.month]);

  const highestCategory = useMemo((): ExpenseCategory => {
    const sorted = [...categoryBreakdown].sort((a, b) => b.total - a.total);
    return sorted[0]?.category || 'Others';
  }, [categoryBreakdown]);

  const totalBudget = useMemo(() => {
    const month = filters.month || new Date().toISOString().slice(0, 7);
    return budgets
      .filter(b => b.month === month)
      .reduce((sum, b) => sum + b.limit, 0);
  }, [budgets, filters.month]);

  const savingsRatio = useMemo(() => {
    if (totalBudget === 0) return 0;
    return Math.max(0, ((totalBudget - totalSpending) / totalBudget) * 100);
  }, [totalBudget, totalSpending]);

  const budgetVsActual = useMemo(() => {
    if (totalBudget === 0) return 0;
    return (totalSpending / totalBudget) * 100;
  }, [totalBudget, totalSpending]);

  const monthlyTrend = useMemo(() => {
    const monthlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const month = expense.date.slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, amount]) => ({
        month,
        amount,
        label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      }));
  }, [expenses]);

  const insights = useMemo((): Insight[] => {
    const results: Insight[] = [];
    const currentMonth = filters.month || new Date().toISOString().slice(0, 7);
    const prevMonth = new Date(new Date(currentMonth + '-01').setMonth(new Date(currentMonth + '-01').getMonth() - 1))
      .toISOString().slice(0, 7);

    // Compare with previous month
    const prevMonthExpenses = expenses.filter(e => e.date.startsWith(prevMonth));
    const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (prevTotal > 0 && totalSpending > 0) {
      const change = ((totalSpending - prevTotal) / prevTotal) * 100;
      if (change > 10) {
        results.push({
          id: 'spending-increase',
          type: 'negative',
          message: `Spending is up ${change.toFixed(0)}% compared to last month`,
          icon: '📈',
        });
      } else if (change < -10) {
        results.push({
          id: 'spending-decrease',
          type: 'positive',
          message: `Great! You've reduced spending by ${Math.abs(change).toFixed(0)}% this month`,
          icon: '💰',
        });
      }
    }

    // Category-specific insights
    categoryBreakdown.forEach(cat => {
      if (cat.isOverBudget && cat.budget) {
        const overBy = ((cat.total - cat.budget) / cat.budget * 100).toFixed(0);
        results.push({
          id: `over-budget-${cat.category}`,
          type: 'negative',
          message: `${cat.category} is ${overBy}% over budget`,
          icon: '⚠️',
        });
      }
    });

    // Highest category insight
    const topCategory = categoryBreakdown[0];
    if (topCategory && topCategory.percentage > 40) {
      results.push({
        id: 'top-category',
        type: 'neutral',
        message: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(0)}% of your spending`,
        icon: '📊',
      });
    }

    // Savings insight
    if (savingsRatio > 20) {
      results.push({
        id: 'good-savings',
        type: 'positive',
        message: `You're on track to save ${savingsRatio.toFixed(0)}% of your budget!`,
        icon: '🎯',
      });
    }

    return results.slice(0, 4);
  }, [expenses, totalSpending, categoryBreakdown, savingsRatio, filters.month]);

  const stats: MonthlyStats = {
    month: filters.month || new Date().toISOString().slice(0, 7),
    totalSpending,
    categoryBreakdown,
    highestCategory,
    savingsRatio,
    budgetVsActual,
  };

  return {
    filteredExpenses,
    totalSpending,
    categoryBreakdown,
    highestCategory,
    savingsRatio,
    budgetVsActual,
    monthlyTrend,
    insights,
    stats,
    totalBudget,
  };
}
