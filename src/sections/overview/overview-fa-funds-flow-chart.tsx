import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  SvgIcon,
  useTheme,
} from "@mui/material";

import { Chart } from "src/components/chart";
import { ChartData } from "src/types/chart-data";
import { formatUSD } from "src/utils/format";

const useChartOptions = (faFundsFlowChartData: ChartData) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.primary.light],
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
      padding: {
        bottom: 32,
      },
    },
    legend: {
      fontSize: "16px",
      itemMargin: {
        horizontal: 16,
      },
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
          fontSize: "16px",
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: formatUSD,
        offsetX: -10,
        style: {
          fontSize: "16px",
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: formatUSD,
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
  const chartOptions = useChartOptions(faFundsFlowChartData);

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
        title="Account funds flow"
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
