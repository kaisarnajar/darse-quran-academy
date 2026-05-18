-- CreateTable
CREATE TABLE "CourseAnnouncement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseAnnouncement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseAnnouncement_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CourseAnnouncement_courseId_idx" ON "CourseAnnouncement"("courseId");
CREATE INDEX "CourseAnnouncement_courseId_createdAt_idx" ON "CourseAnnouncement"("courseId", "createdAt");
