import { toBankDetails, type PaymentSettingsData } from "@/lib/payment-settings";

export type BankDetails = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
};

export function getBankDetailsFromSettings(settings: PaymentSettingsData): BankDetails {
  return toBankDetails(settings);
}
