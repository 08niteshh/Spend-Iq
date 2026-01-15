import { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ExpenseCategory } from '@/types/expense';
import { KPICard } from '@/components/dashboard/KPICard';
import { InsightBadge } from '@/components/dashboard/InsightBadge';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { BudgetProgress } from '@/components/charts/BudgetProgress';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { ImportCSV } from '@/components/expenses/ImportCSV';
import { ExportData } from '@/components/exports/ExportData';
import { FilterBar } from '@/components/filters/FilterBar';
import { BudgetManager } from '@/components/budget/BudgetManager';
import { 
  TrendingUp, 
  PiggyBank, 
  Target,
  Wallet,
  BarChart3,
  IndianRupee
} from 'lucide-react';

const Index = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');

  const {
    expenses,
    budgets,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    importExpenses,
    updateBudget,
  } = useExpenses();

  const filters = useMemo(() => ({
    month: selectedMonth,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  }), [selectedMonth, selectedCategory]);

  const {
    filteredExpenses,
    totalSpending,
    categoryBreakdown,
    highestCategory,
    savingsRatio,
    budgetVsActual,
    monthlyTrend,
    insights,
    totalBudget,
  } = useAnalytics(expenses, budgets, filters);

  const monthLabel = new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Spend<span className="text-gradient">IQ</span>
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Personal Finance Analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ImportCSV onImport={importExpenses} />
            <ExpenseForm onSubmit={addExpense} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar
            selectedMonth={selectedMonth}
            selectedCategory={selectedCategory}
            onMonthChange={setSelectedMonth}
            onCategoryChange={setSelectedCategory}
          />
          <div className="flex items-center gap-2">
            <BudgetManager
              budgets={budgets}
              categoryData={categoryBreakdown}
              currentMonth={selectedMonth}
              onUpdateBudget={updateBudget}
            />
            <ExportData
              expenses={filteredExpenses}
              totalSpending={totalSpending}
              monthLabel={monthLabel}
            />
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {insights.map(insight => (
              <InsightBadge key={insight.id} insight={insight} />
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
            title="Total Spending"
            value={`₹${totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={monthLabel}
            icon={<IndianRupee className="h-6 w-6" />}
            variant="default"
          />
          <KPICard
            title="Top Category"
            value={highestCategory}
            subtitle={`${categoryBreakdown.find(c => c.category === highestCategory)?.percentage.toFixed(0) || 0}% of total`}
            icon={<BarChart3 className="h-6 w-6" />}
            variant="warning"
          />
          <KPICard
            title="Budget Used"
            value={`${budgetVsActual.toFixed(0)}%`}
            subtitle={`₹${totalSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })} of ₹${totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            icon={<Target className="h-6 w-6" />}
            variant={budgetVsActual > 100 ? 'danger' : budgetVsActual > 80 ? 'warning' : 'success'}
          />
          <KPICard
            title="Savings Ratio"
            value={`${savingsRatio.toFixed(0)}%`}
            subtitle={savingsRatio > 20 ? 'Great job!' : 'Room to improve'}
            icon={<PiggyBank className="h-6 w-6" />}
            variant={savingsRatio > 20 ? 'success' : savingsRatio > 10 ? 'warning' : 'danger'}
          />
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <CategoryPieChart data={categoryBreakdown} />
          <MonthlyBarChart data={monthlyTrend} />
          <BudgetProgress data={categoryBreakdown} />
        </div>

        {/* Expense Table */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <span className="text-sm text-muted-foreground">
              {filteredExpenses.length} transactions
            </span>
          </div>
          <ExpenseTable
            expenses={filteredExpenses}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SpendIQ — Track smarter, spend better</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
