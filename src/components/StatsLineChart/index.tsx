'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatsLineChartProps {
  labels: string[];
  data: number[];
  text: string;
}

const StatsLineChart: React.FC<StatsLineChartProps> = ({ labels, data, text }) => {
  const d = {
    labels,
    datasets: [
      {
        label: text,
        data,
        borderColor: 'rgb(200, 100, 22)',
        backgroundColor: 'rgb(200, 100, 22, 0.5)'
      }
    ]
  };
  return <Line data={d} />;
};

export default StatsLineChart;
