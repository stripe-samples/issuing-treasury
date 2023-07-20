import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Bar} from 'react-chartjs-2';

function FaBalanceInOutChart({faTransactionsChart}: any) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
  );

  const options = {
    interaction: {
      intersect: false,
      axis: 'x',
    },
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            }).format(context.parsed.y);
          },
        },
      },
      legend: {
        position: 'top',
        align: 'left',
        labels: {
          usePointStyle: true,
        },
      },
      datalabels: {
        anchor: 'end', // remove this line to get label in middle of the bar
        align: 'end',
        display: 'auto',
        formatter: function (value: any, context: any) {
          return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(value);
        },
        labels: {
          value: {
            color: '#666666',
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          //maxRotation: 90,
          //minRotation: 90
        },
      },
      y: {
        //Provide extra space on the boundaries
        display: true,
        ticks: {
          callback: function (value: any, index: any, values: any) {
            return Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            }).format(value);
          },
        },
        scaleLabel: {
          display: true,
        },
      },
    },
  };

  const data = {
    labels: faTransactionsChart.faTransactionsDates,
    datasets: [
      {
        label: 'Funds in',
        type: 'bar',
        // this dataset is drawn on top
        order: 2,
        data: faTransactionsChart.faTransactionsFundsIn,
        backgroundColor: ['rgba(220, 252, 231, 0.4)'],
        borderColor: ['rgba(22, 101, 52,  1)'],
        borderWidth: 1,
        datalabels: {
          color: '#666666',
        },
      },
      {
        label: 'Funds Out',
        type: 'bar',
        // this dataset is drawn on top
        order: 2,
        data: faTransactionsChart.faTransactionsFundsOut,
        backgroundColor: ['rgba(247, 132, 134, 0.4)'],
        borderColor: ['rgba(250, 0, 4, 1)'],
        borderWidth: 1,
        datalabels: {
          color: '#666666',
        },
      },
    ],
  };
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4 mb-4">
      <Bar options={options} data={data} className="max-h-96" />
    </div>
  );
}
export default FaBalanceInOutChart;
