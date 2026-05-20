-- RedefineTable
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseAnnouncement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "teacherId" TEXT,
    "authorName" TEXT NOT NULL,
    "postedByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "attachmentName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseAnnouncement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseAnnouncement_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CourseAnnouncement" ("id", "courseId", "teacherId", "authorName", "postedByAdmin", "category", "title", "body", "attachmentPath", "attachmentName", "createdAt", "updatedAt")
SELECT
    "id",
    "courseId",
    "teacherId",
    COALESCE((SELECT "name" FROM "Teacher" WHERE "Teacher"."id" = "CourseAnnouncement"."teacherId"), 'Academy'),
    false,
    "category",
    "title",
    "body",
    "attachmentPath",
    "attachmentName",
    "createdAt",
    "updatedAt"
FROM "CourseAnnouncement";
DROP TABLE "CourseAnnouncement";
ALTER TABLE "new_CourseAnnouncement" RENAME TO "CourseAnnouncement";
CREATE INDEX "CourseAnnouncement_courseId_idx" ON "CourseAnnouncement"("courseId");
CREATE INDEX "CourseAnnouncement_courseId_createdAt_idx" ON "CourseAnnouncement"("courseId", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
