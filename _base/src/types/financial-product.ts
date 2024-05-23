// @begin-exclude-from-subapps
enum FinancialProduct {
  ExpenseManagement = "expense_management",
  // Embedded Finance is a full financial services stack for your users:
  // accounts[0] with Treasury to store and send funds, with cards[1] with
  // Issuing for spending.
  // This is different from the Expense Management example, where you
  // top up balances[2] to fund spend on Issuing cards.
  //
  // [0] https://stripe.com/docs/treasury/account-management/financial-accounts
  // [1] https://stripe.com/docs/issuing/how-issuing-works
  // [2] https://stripe.com/docs/issuing/adding-funds-to-your-card-program
  EmbeddedFinance = "embedded_finance",
}

export default FinancialProduct;
// @end-exclude-from-subapps
