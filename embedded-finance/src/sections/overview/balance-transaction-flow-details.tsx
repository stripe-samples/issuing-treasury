import { Stack, Typography } from "@mui/material";
import Stripe from "stripe";

const BalanceTransactionFlowDetails = ({
  transaction,
}: {
  transaction: Stripe.BalanceTransaction;
}) => {
  const flowType = transaction.type;
  const flowDetails = transaction;
  const flowTypeFormatted = flowType.replace(/_/g, " ");

  return flowDetails ? (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">{flowTypeFormatted}</Typography>
    </Stack>
  ) : (
    <Typography variant="body2">{flowTypeFormatted}</Typography>
  );
};

export default BalanceTransactionFlowDetails;
