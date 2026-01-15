import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyBarChartProps {
  data: Array<{ month: string; amount: number; label: string }>;
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Monthly Spending',
        data: data.map(d => d.amount),
        backgroundColor: 'hsla(160, 84%, 39%, 0.8)',
        hoverBackgroundColor: 'hsl(160, 84%, 39%)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          label: (context: any) => `₹${context.raw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(215, 20%, 55%)',
          font: {
            family: 'Inter',
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'hsla(222, 30%, 18%, 0.5)',
        },
        ticks: {
          color: 'hsl(215, 20%, 55%)',
          font: {
            family: 'JetBrains Mono',
            size: 11,
          },
          callback: (value: number | string) => `₹${Number(value).toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return (
    <div className="chart-container h-[300px]">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Monthly Trend
      </h3>
      <div className="h-[250px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
