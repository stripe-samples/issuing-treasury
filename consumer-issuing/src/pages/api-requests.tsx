import React, { ReactNode } from 'react';
import { Box, Container, Typography } from "@mui/material";
import { OverviewApiRequestLogs } from "src/sections/overview/overview-api-request-logs";
import DashboardLayout from "src/layouts/dashboard/layout";

const ApiRequests = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 4 }}>
          API Requests
        </Typography>
        <OverviewApiRequestLogs />
      </Container>
    </Box>
  );
};

ApiRequests.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default ApiRequests; 