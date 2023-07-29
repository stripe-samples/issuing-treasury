import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import {
  alpha,
  Button,
  Card,
  CardContent,
  CardHeader,
  SvgIcon,
  useTheme,
} from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Bar } from "react-chartjs-2";

import { Chart } from "../../components/chart";
import { ChartData } from "../../types/chart-data";

const useChartOptions = () => {
  return {
    interaction: {
      intersect: false,
      axis: "x",
    },
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            }).format(context.parsed.y);
          },
        },
      },
      legend: {
        position: "top",
        align: "left",
        labels: {
          usePointStyle: true,
        },
      },
      datalabels: {
        anchor: "end", // remove this line to get label in middle of the bar
        align: "end",
        display: "auto",
        formatter: function (value: any, context: any) {
          return Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(value);
        },
        labels: {
          value: {
            color: "#666666",
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          // maxRotation: 90,
          // minRotation: 90
        },
      },
      y: {
        // Provide extra space on the boundaries
        display: true,
        ticks: {
          callback: function (value: any, index: any, values: any) {
            return Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
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
};

const useApexChartOptions = (faFundsFlowChartData: ChartData) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.error.light],
    responsive: [
      {
        breakpoint: 480,
        // options: {
        //   legend: {
        //     position: "bottom",
        //   },
        // },
      },
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    // tooltip: {
    //   intersect: false,
    //   x: {
    //     show: false,
    //   },
    //   y: {
    //     formatter: function (value: any) {
    //       return new Intl.NumberFormat("en-US", {
    //         style: "currency",
    //         currency: "USD",
    //         minimumFractionDigits: 2,
    //       }).format(value);
    //     },
    //   },
    // },
    legend: {
      // show: false,
      // position: "bottom",
      // horizontalAlign: "left",
      // markers: {
      //   useSeriesColors: true,
      // },
    },
    // plotOptions: {
    //   bar: {
    //     columnWidth: "20px",
    //   },
    // },
    stroke: {
      // colors: ["transparent"],
      show: false,
      // width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: faFundsFlowChartData.faTransactionsDates,
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(value),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export const OverviewFinancialAccountFundsFlowChart = ({
  faFundsFlowChartData,
  sx,
}: {
  faFundsFlowChartData: ChartData;
  sx?: object;
}) => {
  const chartOptions = useApexChartOptions(faFundsFlowChartData);

  // const chartOptions = {
  //   chart: {
  //     id: "basic-bar",
  //   },
  //   xaxis: {
  //     categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
  //   },
  // };

  // const chartSeries2 = {
  //   labels: faFundsFlowChartData.faTransactionsDates,
  //   datasets: [
  //     {
  //       label: "Funds in",
  //       type: "bar",
  //       // this dataset is drawn on top
  //       order: 2,
  //       data: faFundsFlowChartData.faTransactionsFundsIn,
  //       backgroundColor: ["rgba(220, 252, 231, 0.4)"],
  //       borderColor: ["rgba(22, 101, 52,  1)"],
  //       borderWidth: 1,
  //       datalabels: {
  //         color: "#666666",
  //       },
  //     },
  //     {
  //       label: "Funds Out",
  //       type: "bar",
  //       // this dataset is drawn on top
  //       order: 2,
  //       data: faFundsFlowChartData.faTransactionsFundsOut,
  //       backgroundColor: ["rgba(247, 132, 134, 0.4)"],
  //       borderColor: ["rgba(250, 0, 4, 1)"],
  //       borderWidth: 1,
  //       datalabels: {
  //         color: "#666666",
  //       },
  //     },
  //   ],
  // };

  const chartSeries = [
    {
      name: "Funds in",
      data: faFundsFlowChartData.faTransactionsFundsIn,
    },
    {
      name: "Funds out",
      data: faFundsFlowChartData.faTransactionsFundsOut,
    },
  ];

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            }
          >
            Sync
          </Button>
        }
        title="Account Funds Flow"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
    </Card>
  );
};
