-- CreateTable
CREATE TABLE "DailyInspiration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "arabicText" TEXT NOT NULL,
    "englishTranslation" TEXT NOT NULL,
    "reference" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyInspiration_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DailyInspiration_published_updatedAt_idx" ON "DailyInspiration"("published", "updatedAt");
