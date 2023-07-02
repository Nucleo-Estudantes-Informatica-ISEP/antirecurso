'use client';

import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsPieChartProps {
  labels: string[];
  data: number[];
  text: string;
  options?: ChartOptions<'pie'>;
}

const StatsPieChart: React.FC<StatsPieChartProps> = ({ labels, data, text, options, ...props }) => {
  const DARK_MODE_OPTIONS: ChartOptions<'pie'> = {
    color: 'white',
    ...options
  };

  const d = {
    labels,
    datasets: [
      {
        label: text,
        data,
        backgroundColor: [
          'rgba(55, 229, 2, 0.8)',
          'rgba(255, 22, 12, 0.8)',
          'rgba(100, 100, 100, 0.8)'
        ],
        borderColor: ['rgba(55, 220, 2, 1)', 'rgba(255, 22, 12, 1)', 'rgba(100, 100, 100, 1)'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-xs">
      <div className="block dark:hidden">
        <Pie options={options} data={d} {...props} />
      </div>
      <div className="hidden dark:block">
        <Pie options={DARK_MODE_OPTIONS} data={d} {...props} />{' '}
      </div>
    </div>
  );
};

export default StatsPieChart;
