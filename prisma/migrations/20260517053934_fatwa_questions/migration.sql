-- CreateTable
CREATE TABLE "FatwaQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "askerName" TEXT NOT NULL,
    "askerEmail" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "answeredAt" DATETIME,
    "answeredById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FatwaQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FatwaQuestion_answeredById_fkey" FOREIGN KEY ("answeredById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FatwaQuestion_category_idx" ON "FatwaQuestion"("category");

-- CreateIndex
CREATE INDEX "FatwaQuestion_answeredAt_idx" ON "FatwaQuestion"("answeredAt");
