'use client';

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsPieChartProps {
  labels: string[];
  data: number[];
  text: string;
}

const StatsPieChart: React.FC<StatsPieChartProps> = ({ labels, data, text }) => {
  const d = {
    labels,
    datasets: [
      {
        label: text,
        data,
        backgroundColor: ['rgba(55, 229, 2, 0.8)', 'rgba(255, 22, 12, 0.8)'],
        borderColor: ['rgba(55, 220, 2, 1)', 'rgba(255, 22, 12, 1)'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-xs">
      <Pie data={d} />
    </div>
  );
};

export default StatsPieChart;
