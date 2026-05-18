export type BankDetails = {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
};

/** Academy bank account for NEFT / IMPS / RTGS (override via env in production). */
export function getBankDetails(): BankDetails {
  return {
    accountName: process.env.BANK_ACCOUNT_NAME?.trim() || "Darse Quran Academy",
    bankName: process.env.BANK_NAME?.trim() || "State Bank of India",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER?.trim() || "41234567890",
    ifsc: process.env.BANK_IFSC?.trim() || "SBIN0001234",
    branch: process.env.BANK_BRANCH?.trim() || "Srinagar, Jammu & Kashmir",
  };
}
