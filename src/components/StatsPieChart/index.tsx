'use client';

import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Tooltip } from 'chart.js';
import { useTheme } from 'next-themes';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsPieChartProps {
  labels: string[];
  data: number[];
  text: string;
}

const StatsPieChart: React.FC<StatsPieChartProps> = ({ labels, data, text, ...props }) => {
  const { theme } = useTheme();

  const options: ChartOptions<'pie'> = {
    color: theme === 'dark' ? 'white' : 'black'
  };

  const d = {
    labels,
    datasets: [
      {
        label: text,
        data,
        backgroundColor: ['rgba(91, 142, 125)', 'rgba(188, 75, 81)', 'rgba(100, 100, 100, 0.8)'],
        borderColor: ['rgba(91, 142, 1)', 'rgba(188, 75, 81, 1)', 'rgba(100, 100, 100, 1)'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-xs">
      <div className="h-full">
        <Pie options={options} data={d} {...props} />
      </div>
    </div>
  );
};

export default StatsPieChart;
