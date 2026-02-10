-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "ddfId" TEXT NOT NULL,
    "mlsNumber" TEXT,
    "status" TEXT,
    "addressLine" TEXT,
    "city" TEXT,
    "province" TEXT,
    "postalCode" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "price" INTEGER,
    "beds" INTEGER,
    "baths" INTEGER,
    "propertyType" TEXT,
    "photoUrl" TEXT,
    "raw" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DdfSyncState" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cursor" TEXT,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DdfSyncState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_ddfId_key" ON "Listing"("ddfId");

-- CreateIndex
CREATE INDEX "Listing_mlsNumber_idx" ON "Listing"("mlsNumber");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_city_idx" ON "Listing"("city");

-- CreateIndex
CREATE INDEX "Listing_propertyType_idx" ON "Listing"("propertyType");

-- CreateIndex
CREATE UNIQUE INDEX "DdfSyncState_name_key" ON "DdfSyncState"("name");
