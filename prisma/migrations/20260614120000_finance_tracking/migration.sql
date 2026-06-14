-- AlterTable
ALTER TABLE "PaymentRecord" ADD COLUMN "paymentType" TEXT;

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "amountInrPaise" INTEGER NOT NULL,
    "paidAt" DATETIME NOT NULL,
    "description" TEXT,
    "teacherId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expense_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PaymentRecord_courseId_idx" ON "PaymentRecord"("courseId");

-- CreateIndex
CREATE INDEX "PaymentRecord_paymentType_idx" ON "PaymentRecord"("paymentType");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE INDEX "Expense_paidAt_idx" ON "Expense"("paidAt");

-- CreateIndex
CREATE INDEX "Expense_teacherId_idx" ON "Expense"("teacherId");

-- Backfill paymentType from linked submissions
UPDATE "PaymentRecord"
SET "paymentType" = (
    SELECT "paymentType"
    FROM "CoursePaymentSubmission"
    WHERE "CoursePaymentSubmission"."paymentRecordId" = "PaymentRecord"."id"
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1
    FROM "CoursePaymentSubmission"
    WHERE "CoursePaymentSubmission"."paymentRecordId" = "PaymentRecord"."id"
);

-- Manual entries without a submission
UPDATE "PaymentRecord"
SET "paymentType" = 'manual'
WHERE "paymentType" IS NULL;
