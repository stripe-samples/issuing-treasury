import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
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
  const flowTypeFormatted = flowType.replace(/_/g, " ");

  return flowDetails && flowDetails.hosted_regulatory_receipt_url ? (
    <div>
      <span>{flowTypeFormatted}</span>
      <a href={flowDetails.hosted_regulatory_receipt_url} target="_blank">Link</a>
    </div>
  ) : (
    <Typography>{flowTypeFormatted}</Typography>
  );
};

export default TransactionFlowDetails;
