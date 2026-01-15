import { useState, useEffect, useCallback } from 'react';
import { Expense, Budget, ExpenseCategory, CATEGORIES } from '@/types/expense';

const STORAGE_KEY = 'spendiq_expenses';
const BUDGET_KEY = 'spendiq_budgets';

const generateId = () => Math.random().toString(36).substring(2, 15);

const sampleExpenses: Expense[] = [
  { id: generateId(), amount: 45.50, category: 'Food', description: 'Groceries', date: '2026-01-10', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 120.00, category: 'Bills', description: 'Electric bill', date: '2026-01-08', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 35.00, category: 'Travel', description: 'Uber rides', date: '2026-01-07', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 89.99, category: 'Shopping', description: 'New headphones', date: '2026-01-06', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 60.00, category: 'Health', description: 'Gym membership', date: '2026-01-05', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 25.00, category: 'Food', description: 'Restaurant dinner', date: '2026-01-04', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 150.00, category: 'Shopping', description: 'Winter jacket', date: '2026-01-03', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 80.00, category: 'Bills', description: 'Internet', date: '2026-01-02', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 15.00, category: 'Others', description: 'Subscription', date: '2026-01-01', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 200.00, category: 'Travel', description: 'Flight booking', date: '2025-12-28', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 55.00, category: 'Food', description: 'Weekly groceries', date: '2025-12-25', createdAt: new Date().toISOString() },
  { id: generateId(), amount: 40.00, category: 'Health', description: 'Vitamins', date: '2025-12-20', createdAt: new Date().toISOString() },
];

const defaultBudgets: Budget[] = CATEGORIES.map(category => ({
  category,
  limit: category === 'Food' ? 400 : category === 'Bills' ? 300 : category === 'Travel' ? 200 : 150,
  month: '2026-01',
}));

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedBudgets = localStorage.getItem(BUDGET_KEY);
    
    if (stored) {
      setExpenses(JSON.parse(stored));
    } else {
      setExpenses(sampleExpenses);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleExpenses));
    }
    
    if (storedBudgets) {
      setBudgets(JSON.parse(storedBudgets));
    } else {
      setBudgets(defaultBudgets);
      localStorage.setItem(BUDGET_KEY, JSON.stringify(defaultBudgets));
    }
    
    setIsLoading(false);
  }, []);

  const saveExpenses = useCallback((newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  }, []);

  const saveBudgets = useCallback((newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem(BUDGET_KEY, JSON.stringify(newBudgets));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    saveExpenses([newExpense, ...expenses]);
    return newExpense;
  }, [expenses, saveExpenses]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(e => 
      e.id === id ? { ...e, ...updates } : e
    );
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const deleteExpense = useCallback((id: string) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  }, [expenses, saveExpenses]);

  const importExpenses = useCallback((newExpenses: Omit<Expense, 'id' | 'createdAt'>[]) => {
    const expensesWithIds = newExpenses.map(e => ({
      ...e,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
    saveExpenses([...expensesWithIds, ...expenses]);
    return expensesWithIds.length;
  }, [expenses, saveExpenses]);

  const updateBudget = useCallback((category: ExpenseCategory, limit: number, month: string) => {
    const existing = budgets.findIndex(b => b.category === category && b.month === month);
    let updated: Budget[];
    
    if (existing >= 0) {
      updated = budgets.map((b, i) => i === existing ? { ...b, limit } : b);
    } else {
      updated = [...budgets, { category, limit, month }];
    }
    
    saveBudgets(updated);
  }, [budgets, saveBudgets]);

  const getBudget = useCallback((category: ExpenseCategory, month: string): number | undefined => {
    return budgets.find(b => b.category === category && b.month === month)?.limit;
  }, [budgets]);

  return {
    expenses,
    budgets,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    importExpenses,
    updateBudget,
    getBudget,
  };
}
