import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { Stack, Typography, SvgIcon } from "@mui/material";
import Link from "next/link";
import Stripe from "stripe";

type FlowDetailsWithRegulatoryReceiptUrl<T extends string> = T extends
  | "other"
  | "issuing_authorization"
  ? never
  : T;

const TransactionFlowDetails = ({
  transaction,
}: {
  transaction: Stripe.Treasury.Transaction;
}) => {
  const flowType =
    transaction.flow_type as FlowDetailsWithRegulatoryReceiptUrl<Stripe.Treasury.Transaction.FlowType>;
  const flowDetails = transaction.flow_details?.[flowType];

  return flowDetails && flowDetails.hosted_regulatory_receipt_url ? (
    <Stack direction="row" spacing={1}>
      <Typography>{transaction.flow_type}</Typography>
      <Link href={flowDetails.hosted_regulatory_receipt_url} target="_blank">
        <SvgIcon>
          <DocumentArrowDownIcon />
        </SvgIcon>
      </Link>
    </Stack>
  ) : (
    <Typography>{transaction.flow_type}</Typography>
  );
};

export default TransactionFlowDetails;
