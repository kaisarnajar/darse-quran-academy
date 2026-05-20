import { getPaymentSettings, toBankDetails, type PaymentSettingsData } from "@/lib/payment-settings";

export type BankDetails = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
};

/** Load bank details from admin payment settings (with env fallbacks). */
export async function getBankDetails(): Promise<BankDetails> {
  const settings = await getPaymentSettings();
  return toBankDetails(settings);
}

export function getBankDetailsFromSettings(settings: PaymentSettingsData): BankDetails {
  return toBankDetails(settings);
}
