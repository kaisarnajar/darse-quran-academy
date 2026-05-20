-- AlterTable
ALTER TABLE "PaymentRecord" ADD COLUMN "uploadedReceiptPath" TEXT;
ALTER TABLE "PaymentRecord" ADD COLUMN "receiptEmailSentAt" DATETIME;
