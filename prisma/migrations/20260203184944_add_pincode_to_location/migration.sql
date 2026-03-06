-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "pincode" TEXT;

-- CreateIndex
CREATE INDEX "Location_pincode_idx" ON "Location"("pincode");
