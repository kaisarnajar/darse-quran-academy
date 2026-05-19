-- CreateTable
CREATE TABLE "SiteAnnouncement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "eventDate" TEXT,
    "location" TEXT,
    "imagePath" TEXT,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SiteAnnouncement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SiteAnnouncement_published_showOnHomepage_idx" ON "SiteAnnouncement"("published", "showOnHomepage");
CREATE INDEX "SiteAnnouncement_published_createdAt_idx" ON "SiteAnnouncement"("published", "createdAt");
