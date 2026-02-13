-- AlterTable
ALTER TABLE "DdfSyncState" ADD COLUMN "status" TEXT;
ALTER TABLE "DdfSyncState" ADD COLUMN "lastError" TEXT;
ALTER TABLE "DdfSyncState" ADD COLUMN "processed" INTEGER;
ALTER TABLE "DdfSyncState" ADD COLUMN "upserted" INTEGER;
ALTER TABLE "DdfSyncState" ADD COLUMN "errorCount" INTEGER;
