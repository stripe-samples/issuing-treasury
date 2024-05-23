import { Platform } from "./platform-stripe-account-helpers";

interface StripeAccount {
  accountId: string;
  platform: Platform;
}

export default StripeAccount;
