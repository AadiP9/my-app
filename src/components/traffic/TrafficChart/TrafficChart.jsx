import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './TrafficChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrafficChart = () => {
  // Sample data for the chart
  const data = {
    labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    datasets: [
      {
        label: 'Downtown Traffic',
        data: [65, 85, 75, 90, 95, 70, 45],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Highway Traffic',
        data: [45, 60, 70, 85, 80, 65, 40],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Traffic Patterns - Last 24 Hours',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Congestion Level (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time of Day'
        }
      }
    },
  };

  return (
    <div className="traffic-chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default TrafficChart;