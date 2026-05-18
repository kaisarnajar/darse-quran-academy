-- CreateEnum
-- SQLite stores enums as TEXT
-- AlterTable
ALTER TABLE "User" ADD COLUMN "fatherName" TEXT;
ALTER TABLE "User" ADD COLUMN "dateOfBirth" DATETIME;
ALTER TABLE "User" ADD COLUMN "occupation" TEXT;
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "User" ADD COLUMN "whatsapp" TEXT;
