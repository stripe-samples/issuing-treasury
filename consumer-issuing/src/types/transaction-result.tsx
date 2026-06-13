enum TransactionResult {
  POSTED = "posted",
  PROCESSING = "processing",
  // TODO: Handle the return status of the transaction result
  // RETURNED = "return",
  FAILED = "fail",
}

export default TransactionResult;
