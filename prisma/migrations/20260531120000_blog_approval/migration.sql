-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "approvalStatus" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlogPost_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BlogPost" ("id", "title", "excerpt", "body", "published", "approvalStatus", "createdById", "createdAt", "updatedAt")
SELECT
    "id",
    "title",
    "excerpt",
    "body",
    "published",
    CASE WHEN "published" = 1 THEN 'APPROVED' ELSE 'DRAFT' END,
    "createdById",
    "createdAt",
    "updatedAt"
FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE INDEX "BlogPost_published_approvalStatus_createdAt_idx" ON "BlogPost"("published", "approvalStatus", "createdAt");
CREATE INDEX "BlogPost_approvalStatus_createdAt_idx" ON "BlogPost"("approvalStatus", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
