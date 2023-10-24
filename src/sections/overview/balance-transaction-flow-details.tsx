import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { Stack, Typography, SvgIcon, Link } from "@mui/material";
import Stripe from "stripe";

type FlowDetailsWithRegulatoryReceiptUrl<T extends string> = T extends
  | "other"
  | "issuing_authorization"
  ? never
  : T;

const BalanceTransactionFlowDetails = ({
  transaction,
}: {
  // transaction: Stripe.Treasury.Transaction;
  transaction: Stripe.BalanceTransaction;
}) => {
  const flowType = transaction.type //as FlowDetailsWithRegulatoryReceiptUrl<Stripe.Treasury.Transaction.FlowType>;
  const flowDetails = transaction //.flow_details?.[flowType];
  const flowTypeFormatted = flowType.replace(/_/g, " ");

  // return flowDetails && flowDetails.hosted_regulatory_receipt_url ? (
    return flowDetails ? (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">{flowTypeFormatted}</Typography>
      {/* <Link href={flowDetails.hosted_regulatory_receipt_url} target="_blank">
        <SvgIcon fontSize="small" sx={{ verticalAlign: "top" }}>
          <DocumentArrowDownIcon />
        </SvgIcon>
      </Link> */}
    </Stack>
  ) : (
    <Typography variant="body2">{flowTypeFormatted}</Typography>
  );
};

export default BalanceTransactionFlowDetails;
