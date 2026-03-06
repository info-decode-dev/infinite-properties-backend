-- DropIndex
DROP INDEX "FeaturedMedia_featuredPropertyId_key";

-- CreateTable
CREATE TABLE "PropertyCollection" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "curatedCollectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyCollection_propertyId_idx" ON "PropertyCollection"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyCollection_curatedCollectionId_idx" ON "PropertyCollection"("curatedCollectionId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyCollection_propertyId_curatedCollectionId_key" ON "PropertyCollection"("propertyId", "curatedCollectionId");

-- CreateIndex
CREATE INDEX "FeaturedMedia_featuredPropertyId_idx" ON "FeaturedMedia"("featuredPropertyId");

-- AddForeignKey
ALTER TABLE "PropertyCollection" ADD CONSTRAINT "PropertyCollection_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyCollection" ADD CONSTRAINT "PropertyCollection_curatedCollectionId_fkey" FOREIGN KEY ("curatedCollectionId") REFERENCES "CuratedCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
