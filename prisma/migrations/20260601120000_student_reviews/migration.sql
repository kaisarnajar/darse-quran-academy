-- CreateTable
CREATE TABLE "StudentReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "course" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "featuredOnHomepage" BOOLEAN NOT NULL DEFAULT false,
    "featuredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudentReview_status_createdAt_idx" ON "StudentReview"("status", "createdAt");
CREATE INDEX "StudentReview_featuredOnHomepage_featuredAt_idx" ON "StudentReview"("featuredOnHomepage", "featuredAt");
CREATE INDEX "StudentReview_userId_status_idx" ON "StudentReview"("userId", "status");
