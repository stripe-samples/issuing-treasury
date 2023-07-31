import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { ReactNode } from "react";

import { Logo } from "src/components/logo";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
      }}
    >
      <Grid container sx={{ flex: "1 1 auto" }}>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: "fixed",
              top: 0,
              width: "100%",
            }}
          >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: "inline-flex",
                height: 32,
                width: 32,
              }}
            >
              <Logo />
            </Box>
          </Box>
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            alignItems: "center",
            background:
              "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            "& img": {
              maxWidth: "100%",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                mb: 1,
              }}
              variant="h1"
            >
              Welcome to{" "}
              <Box component="a" sx={{ color: "#15B79E" }} target="_blank">
                Stripe Issuing & Treasury Demo
              </Box>
            </Typography>
            <Typography align="center" sx={{ mb: 3 }} variant="subtitle1">
              Try embedded finance features and examine our open source GitHub
            </Typography>
            <Box>
              <img
                alt="Issuing credit cards"
                src="/assets/issuing-credit-cards.png"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
