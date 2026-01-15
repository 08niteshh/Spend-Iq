import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CategorySummary, CATEGORY_COLORS } from '@/types/expense';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CategoryPieChartProps {
  data: CategorySummary[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const filteredData = data.filter(d => d.total > 0);

  const chartData = {
    labels: filteredData.map(d => d.category),
    datasets: [
      {
        data: filteredData.map(d => d.total),
        backgroundColor: filteredData.map(d => CATEGORY_COLORS[d.category]),
        borderColor: 'hsl(222, 47%, 8%)',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'hsl(215, 20%, 55%)',
          font: {
            family: 'Inter',
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(222, 47%, 10%)',
        titleColor: 'hsl(210, 40%, 98%)',
        bodyColor: 'hsl(210, 40%, 98%)',
        borderColor: 'hsl(222, 30%, 18%)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: 'Inter',
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: 'JetBrains Mono',
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number;
            const percentage = filteredData[context.dataIndex]?.percentage || 0;
            return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container h-[300px]">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Category Distribution
      </h3>
      <div className="h-[250px]">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
