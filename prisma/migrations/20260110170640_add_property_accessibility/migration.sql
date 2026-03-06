/*
  Warnings:

  - Added the required column `builtUpArea` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landArea` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landAreaUnit` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "builtUpArea" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "furnishedStatus" TEXT,
ADD COLUMN     "landArea" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "landAreaUnit" TEXT NOT NULL,
ADD COLUMN     "nearbyLandmarks" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "negotiation" TEXT,
ADD COLUMN     "propertyType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PropertyAccessibility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distance" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyAccessibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyAccessibility_propertyId_idx" ON "PropertyAccessibility"("propertyId");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- AddForeignKey
ALTER TABLE "PropertyAccessibility" ADD CONSTRAINT "PropertyAccessibility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
