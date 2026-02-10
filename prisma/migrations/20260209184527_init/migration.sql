/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BuildingNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contractor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedListing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedSearch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BuildingNote" DROP CONSTRAINT "BuildingNote_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "SavedListing" DROP CONSTRAINT "SavedListing_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSearch" DROP CONSTRAINT "SavedSearch_userId_fkey";

-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
DROP COLUMN "role",
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "BuildingNote";

-- DropTable
DROP TABLE "Contractor";

-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "SavedListing";

-- DropTable
DROP TABLE "SavedSearch";

-- DropEnum
DROP TYPE "UserRole";
