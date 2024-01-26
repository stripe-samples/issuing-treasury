import { Platform } from "./platform";

interface StripeAccount {
  accountId: string;
  platform: Platform;
}

export default StripeAccount;
