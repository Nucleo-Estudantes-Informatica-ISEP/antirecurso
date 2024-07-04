'use client';

import { Chart as ChartJS, ChartOptions, registerables } from 'chart.js';
import { useTheme } from 'next-themes';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  labels: string[];
  data: number[];
  title: string;
}

ChartJS.register(...registerables);

const BarChart: React.FC<BarChartProps> = ({ labels, data, title, ...props }) => {
  const { theme } = useTheme();

  const options: ChartOptions<'bar'> = {
    color: theme === 'dark' ? 'white' : 'black',
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const d = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderWidth: 1,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ]
      }
    ]
  };

  return (
    <div className="size-full">
      <Bar options={options} data={d} {...props} />
    </div>
  );
};

export default BarChart;
