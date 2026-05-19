-- CreateTable
CREATE TABLE "CoursePaymentSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amountInrPaise" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_verification',
    "paymentMethod" TEXT,
    "upiTransactionId" TEXT,
    "paymentScreenshotPath" TEXT,
    "paymentReference" TEXT,
    "paymentRecordId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CoursePaymentSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoursePaymentSubmission_paymentRecordId_fkey" FOREIGN KEY ("paymentRecordId") REFERENCES "PaymentRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CoursePaymentSubmission_paymentReference_key" ON "CoursePaymentSubmission"("paymentReference");
CREATE UNIQUE INDEX "CoursePaymentSubmission_paymentRecordId_key" ON "CoursePaymentSubmission"("paymentRecordId");
CREATE INDEX "CoursePaymentSubmission_userId_idx" ON "CoursePaymentSubmission"("userId");
CREATE INDEX "CoursePaymentSubmission_courseId_idx" ON "CoursePaymentSubmission"("courseId");
CREATE INDEX "CoursePaymentSubmission_status_idx" ON "CoursePaymentSubmission"("status");
