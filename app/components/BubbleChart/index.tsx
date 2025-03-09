import {
  Chart,
  LinearScale,
  Title,
  Tooltip,
  ArcElement,
  BubbleController,
  PointElement,
} from 'chart.js';
import { useEffect, useRef } from 'react';

// Register necessary chart components
Chart.register(
  LinearScale,
  Title,
  Tooltip,
  ArcElement,
  BubbleController,
  PointElement,
);

export const BubbleChart = ({
  movieMap,
}: {
  movieMap: Map<number, string[]>;
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Prepare chart data from the movieMap
    const chartData = Array.from(movieMap.entries()).map(([year, movies]) => ({
      x: year, // Year (X-axis)
      y: movies.length, // Number of movies released (Y-axis)
      r: movies.length * 5, // Bubble size, you can adjust the multiplier
    }));

    // Create the chart
    const chart = new Chart(chartRef.current, {
      type: 'bubble',

      data: {
        datasets: [
          {
            label: 'Movies per Year',
            data: chartData,
            backgroundColor: '#d91a29', // You can change the color
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Year',
              font: {
                size: 16,
              },
              color: '#fff',
            },
            min: new Date().getFullYear() - 100,
            max: new Date().getFullYear(),
            ticks: {
              callback: function (value) {
                // Remove the commas or format the number as you like
                return value.toString(); // Simple number formatting without commas
              },
              font: {
                size: 14,
              },
            },
            grid: {
              color: '#9c9c9c', // Set grid color for the X-axis
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Movies',
              font: {
                size: 16,
              },
              color: '#fff',
            },
            ticks: {
              font: {
                size: 14,
              },
            },
            grid: {
              color: '#9c9c9c', // Set grid color for the X-axis
            },
          },
        },
      },
    });

    // Cleanup chart when component is unmounted
    return () => {
      chart.destroy();
    };
  }, [movieMap]);

  return <canvas ref={chartRef}></canvas>;
};
