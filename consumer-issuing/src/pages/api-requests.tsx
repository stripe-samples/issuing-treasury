import React, { ReactNode, useState, useRef } from 'react';
import { Box, Container, Typography, Button } from "@mui/material";
import { OverviewApiRequestLogs } from "src/sections/overview/overview-api-request-logs";
import DashboardLayout from "src/layouts/dashboard/layout";

const ApiRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const logsRef = useRef<{ refresh: () => Promise<void> }>(null);

  const handleFetchCreditData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/fetch_credit_data", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        // Refresh the logs to show the new entries
        await logsRef.current?.refresh();
      } else {
        console.error("Failed to fetch credit data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching credit data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            API Requests
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            onClick={handleFetchCreditData}
          >
            {isLoading ? "Fetching..." : "Fetch Credit Data"}
          </Button>
        </Box>
        <OverviewApiRequestLogs ref={logsRef} />
      </Container>
    </Box>
  );
};

ApiRequests.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default ApiRequests; 