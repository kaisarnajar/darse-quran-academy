import type { BankDetails } from "@/lib/bank";
import { prisma } from "@/lib/prisma";

export const PAYMENT_SETTINGS_ID = "default";

export type PaymentSettingsData = {
  upiId: string;
  upiPayeeName: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
};

function envDefaults(): PaymentSettingsData {
  return {
    upiId: process.env.UPI_ID?.trim() ?? "",
    upiPayeeName: process.env.UPI_PAYEE_NAME?.trim() || "Darse Quran Academy",
    bankAccountName: process.env.BANK_ACCOUNT_NAME?.trim() || "Darse Quran Academy",
    bankName: process.env.BANK_NAME?.trim() || "State Bank of India",
    bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER?.trim() || "",
    bankIfsc: process.env.BANK_IFSC?.trim() || "",
    bankBranch: process.env.BANK_BRANCH?.trim() || "",
  };
}

function mergeWithEnv(row: {
  upiId: string;
  upiPayeeName: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
}): PaymentSettingsData {
  const env = envDefaults();
  return {
    upiId: row.upiId.trim() || env.upiId,
    upiPayeeName: row.upiPayeeName.trim() || env.upiPayeeName,
    bankAccountName: row.bankAccountName.trim() || env.bankAccountName,
    bankName: row.bankName.trim() || env.bankName,
    bankAccountNumber: row.bankAccountNumber.trim() || env.bankAccountNumber,
    bankIfsc: row.bankIfsc.trim() || env.bankIfsc,
    bankBranch: row.bankBranch.trim() || env.bankBranch,
  };
}

export async function getPaymentSettings(): Promise<PaymentSettingsData> {
  const row = await prisma.paymentSettings.findUnique({
    where: { id: PAYMENT_SETTINGS_ID },
  });

  if (!row) {
    return envDefaults();
  }

  return mergeWithEnv(row);
}

export function toBankDetails(settings: PaymentSettingsData): BankDetails {
  return {
    accountName: settings.bankAccountName,
    bankName: settings.bankName,
    accountNumber: settings.bankAccountNumber,
    ifsc: settings.bankIfsc,
    branch: settings.bankBranch,
  };
}

export function isUpiConfiguredFromSettings(settings: PaymentSettingsData): boolean {
  return Boolean(settings.upiId.trim());
}
