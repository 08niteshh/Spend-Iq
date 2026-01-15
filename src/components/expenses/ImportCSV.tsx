import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ExpenseCategory, CATEGORIES } from '@/types/expense';
import { toast } from 'sonner';

interface ImportCSVProps {
  onImport: (expenses: Array<{
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string;
  }>) => number;
}

export function ImportCSV({ onImport }: ImportCSVProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizeCategory = (cat: string): ExpenseCategory => {
    const normalized = cat.trim().toLowerCase();
    const found = CATEGORIES.find(c => c.toLowerCase() === normalized);
    return found || 'Others';
  };

  const parseData = (data: any[]): Array<{
    amount: number;
    category: ExpenseCategory;
    description: string;
    date: string;
  }> => {
    return data
      .filter(row => row.amount || row.Amount)
      .map(row => ({
        amount: parseFloat(row.amount || row.Amount || '0'),
        category: normalizeCategory(row.category || row.Category || 'Others'),
        description: row.description || row.Description || '',
        date: row.date || row.Date || new Date().toISOString().slice(0, 10),
      }))
      .filter(e => e.amount > 0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (extension === 'csv') {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const expenses = parseData(results.data);
            const count = onImport(expenses);
            toast.success(`Imported ${count} expenses successfully`);
          },
          error: () => {
            toast.error('Failed to parse CSV file');
          },
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const expenses = parseData(data);
        const count = onImport(expenses);
        toast.success(`Imported ${count} expenses successfully`);
      } else {
        toast.error('Please upload a CSV or Excel file');
      }
    } catch {
      toast.error('Failed to import file');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        className="gap-2 border-border/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Import CSV/Excel
      </Button>
    </div>
  );
}
