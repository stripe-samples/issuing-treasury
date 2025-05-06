import { Avatar, Card, CardContent, Link, Stack, Typography, Box } from "@mui/material";
import { DocumentCurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { CountryConfigMap } from "src/utils/account-management-helpers";
import { formatCurrencyForCountry } from "src/utils/format";
import FloatingPaymentPanel from "src/components/floating-payment-panel";
import { TestDataMakePayment } from "src/sections/test-data/test-data-make-payment";

type Statement = {
  id: string;
  filename: string;
  url: string;
};

export const OverviewCreditStatement = (props: {
  sx: object;
  creditLimit: number;
}) => {
  const { sx, creditLimit } = props;
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  if (session == undefined) {
    throw new Error("Session is missing in the request");
  }
  const { country } = session;

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch('/api/get_statements');
        if (!response.ok) {
          throw new Error('Failed to fetch statements');
        }
        const data = await response.json();
        setStatements(data.statements);
      } catch (err) {
        setError('Failed to load statements');
        console.error('Error fetching statements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Statements
            </Typography>
            {loading ? (
              <Typography>Loading statements...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : statements.length === 0 ? (
              <Typography color="text.secondary">No statements available</Typography>
            ) : (
              <Stack spacing={1}>
                {statements.map((statement) => (
                  <Link
                    key={statement.id}
                    href={statement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    download={false}
                  >
                    {statement.filename.replace('.pdf', '')}
                  </Link>
                ))}
              </Stack>
            )}
          </Stack>
          <Stack spacing={1} alignItems="flex-start">
            <Box sx={{ height: 24 }} />
            <FloatingPaymentPanel
              title="Make Payment"
              buttonText="Make Payment"
              buttonProps={{
                variant: "contained",
                color: "primary",
                size: "small"
              }}
            >
              <TestDataMakePayment />
            </FloatingPaymentPanel>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <DocumentCurrencyDollarIcon className="text-white" style={{ width: 24, height: 24 }} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}; 