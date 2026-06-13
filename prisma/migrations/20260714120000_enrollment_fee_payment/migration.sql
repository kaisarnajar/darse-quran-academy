-- Enrollment fee payment support (SQLite local + PostgreSQL production).

DELETE FROM "Enrollment"
WHERE "status" IN ('pending_verification', 'payment_declined');

UPDATE "Enrollment"
SET "status" = 'pending_approval'
WHERE "status" = 'pending';

ALTER TABLE "CoursePaymentSubmission" ADD COLUMN "paymentType" TEXT NOT NULL DEFAULT 'monthly';

CREATE INDEX "CoursePaymentSubmission_paymentType_idx" ON "CoursePaymentSubmission"("paymentType");

-- SQLite requires dropping the unique index before DROP COLUMN on paymentReference.
DROP INDEX IF EXISTS "Enrollment_paymentReference_key";

ALTER TABLE "Enrollment" DROP COLUMN "paymentReference";
ALTER TABLE "Enrollment" DROP COLUMN "upiTransactionId";
ALTER TABLE "Enrollment" DROP COLUMN "paymentMethod";
ALTER TABLE "Enrollment" DROP COLUMN "paymentScreenshotPath";
ALTER TABLE "Enrollment" DROP COLUMN "amountPaid";
ALTER TABLE "Enrollment" DROP COLUMN "currency";
