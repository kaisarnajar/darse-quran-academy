-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "upiId" TEXT NOT NULL DEFAULT '',
    "upiPayeeName" TEXT NOT NULL DEFAULT 'Darse Quran Academy',
    "bankAccountName" TEXT NOT NULL DEFAULT 'Darse Quran Academy',
    "bankName" TEXT NOT NULL DEFAULT '',
    "bankAccountNumber" TEXT NOT NULL DEFAULT '',
    "bankIfsc" TEXT NOT NULL DEFAULT '',
    "bankBranch" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
