import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportDataProps {
  expenses: Expense[];
  totalSpending: number;
  monthLabel: string;
}

export function ExportData({ expenses, totalSpending, monthLabel }: ExportDataProps) {
  const exportToExcel = () => {
    const data = expenses.map(e => ({
      Date: e.date,
      Description: e.description,
      Category: e.category,
      Amount: e.amount,
    }));

    data.push({
      Date: '',
      Description: 'TOTAL',
      Category: '',
      Amount: totalSpending,
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, `SpendIQ_Report_${monthLabel}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Primary color
    doc.text('SpendIQ Report', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Period: ${monthLabel}`, 20, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 38);

    // Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Total Spending: ₹${totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 20, 52);

    // Table
    const tableData = expenses.map(e => [
      e.date,
      e.description,
      e.category,
      `₹${e.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 10,
      },
      foot: [['', '', 'Total', `₹${totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`]],
      footStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });

    doc.save(`SpendIQ_Report_${monthLabel}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 border-border/50">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border/50">
        <DropdownMenuItem onClick={exportToExcel} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Export to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
