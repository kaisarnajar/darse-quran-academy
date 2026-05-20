-- AlterTable
ALTER TABLE "CourseAnnouncement" ADD COLUMN "enrollmentId" TEXT;

-- CreateIndex
CREATE INDEX "CourseAnnouncement_enrollmentId_idx" ON "CourseAnnouncement"("enrollmentId");
CREATE INDEX "CourseAnnouncement_courseId_enrollmentId_idx" ON "CourseAnnouncement"("courseId", "enrollmentId");
