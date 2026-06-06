-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseAnnouncement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "enrollmentId" TEXT,
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
    CONSTRAINT "CourseAnnouncement_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseAnnouncement_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CourseAnnouncement" ("attachmentName", "attachmentPath", "authorName", "body", "category", "courseId", "createdAt", "enrollmentId", "id", "postedByAdmin", "teacherId", "title", "updatedAt") SELECT "attachmentName", "attachmentPath", "authorName", "body", "category", "courseId", "createdAt", "enrollmentId", "id", "postedByAdmin", "teacherId", "title", "updatedAt" FROM "CourseAnnouncement";
DROP TABLE "CourseAnnouncement";
ALTER TABLE "new_CourseAnnouncement" RENAME TO "CourseAnnouncement";
CREATE INDEX "CourseAnnouncement_courseId_idx" ON "CourseAnnouncement"("courseId");
CREATE INDEX "CourseAnnouncement_courseId_createdAt_idx" ON "CourseAnnouncement"("courseId", "createdAt");
CREATE INDEX "CourseAnnouncement_enrollmentId_idx" ON "CourseAnnouncement"("enrollmentId");
CREATE INDEX "CourseAnnouncement_courseId_enrollmentId_idx" ON "CourseAnnouncement"("courseId", "enrollmentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
