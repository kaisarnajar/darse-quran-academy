-- Add course duration field for admin-configured program length.
ALTER TABLE "Course" ADD COLUMN "duration" TEXT NOT NULL DEFAULT '';
