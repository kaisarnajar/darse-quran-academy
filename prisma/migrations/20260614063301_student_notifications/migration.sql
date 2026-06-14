-- CreateTable
CREATE TABLE "StudentNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "href" TEXT NOT NULL,
    "readAt" DATETIME,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StudentNotification_userId_readAt_idx" ON "StudentNotification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "StudentNotification_userId_createdAt_idx" ON "StudentNotification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentNotification_userId_type_sourceId_key" ON "StudentNotification"("userId", "type", "sourceId");
