import { Box, Container, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";

import DashboardLayout from "src/layouts/dashboard/layout";
import SettingsDeleteAccount from "src/sections/settings/settings-delete-account";

const Page = () => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">Settings</Typography>
            <SettingsDeleteAccount />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
