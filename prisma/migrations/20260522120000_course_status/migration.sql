-- AlterTable: replace published boolean with course status enum (SQLite stores as TEXT)
ALTER TABLE "Course" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PUBLISHED';

UPDATE "Course" SET "status" = 'PUBLISHED' WHERE "published" = 1;
UPDATE "Course" SET "status" = 'DRAFT' WHERE "published" = 0;

-- RedefineTable
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priceInrPaise" INTEGER NOT NULL,
    "teacherId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("id", "title", "description", "startDate", "level", "category", "priceInrPaise", "teacherId", "status", "createdAt", "updatedAt")
SELECT "id", "title", "description", "startDate", "level", "category", "priceInrPaise", "teacherId", "status", "createdAt", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
