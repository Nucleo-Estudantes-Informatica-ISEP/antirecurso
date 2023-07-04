'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { useTheme } from 'next-themes';
import { useId } from 'react';
import { Line } from 'react-chartjs-2';
import regression, { DataPoint } from 'regression';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatsLineChartProps {
  labels: string[];
  data: number[];
  text: string;
}

const StatsLineChart: React.FC<StatsLineChartProps> = ({ labels, data, text }) => {
  const dataPoints = data.map((value, index) => [index, value] as DataPoint);
  const regressionLine = regression.linear(dataPoints).points.map((point) => point[1]);

  const { theme } = useTheme();

  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,

    scales: {
      y: {
        min: 0,
        max: 20,
        ticks: {
          stepSize: 0.5,
          color: theme === 'dark' ? 'white' : 'black'
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black'
        }
      }
    },
    color: theme === 'dark' ? 'white' : 'black'
  };

  const d: ChartData<'line', number[], string> = {
    labels,

    datasets: [
      {
        label: text,
        data,
        borderColor: 'rgb(200, 100, 22)',
        backgroundColor: 'rgb(200, 100, 22, 0.5)'
      },
      {
        label: 'Evolução',
        data: regressionLine,
        borderColor: theme === 'dark' ? '#ddd' : 'rgb(100, 100, 100)',
        backgroundColor: theme === 'dark' ? 'rgb(200,200,200,.05)' : 'rgb(100, 100, 100, 0.5)'
      }
    ]
  };
  return (
    <div className="h-full">
      <div className="h-full">
        <Line
          data={d}
          key={useId()}
          style={{
            position: 'relative',
            width: 'full',
            overflowX: 'scroll'
          }}
          options={options}
        />
      </div>
    </div>
  );
};

export default StatsLineChart;
