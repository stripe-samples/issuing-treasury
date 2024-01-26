import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => null,
});

export const Chart = styled(ApexChart)``;
