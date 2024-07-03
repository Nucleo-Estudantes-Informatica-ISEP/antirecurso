'use client';

import { ArcElement, Chart as ChartJS, ChartOptions, Legend, Tooltip } from 'chart.js';
import { useTheme } from 'next-themes';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsPieChartProps {
  labels: string[];
  data: number[];
  text: string;
  backgroundColor: string[];
  borderColor: string[];
}

const StatsPieChart: React.FC<StatsPieChartProps> = ({
  labels,
  data,
  text,
  backgroundColor,
  borderColor,
  ...props
}) => {
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
        backgroundColor,
        borderColor,
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-[320px]">
      <div className="h-full">
        <Pie options={options} data={d} {...props} />
      </div>
    </div>
  );
};

export default StatsPieChart;
