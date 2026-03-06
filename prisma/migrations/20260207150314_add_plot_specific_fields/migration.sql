-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "landType" TEXT,
ADD COLUMN     "ownership" TEXT,
ADD COLUMN     "plotSize" DECIMAL(12,2),
ADD COLUMN     "plotSizeUnit" TEXT,
ALTER COLUMN "bhkType" DROP NOT NULL,
ALTER COLUMN "constructionStatus" DROP NOT NULL,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "builtUpArea" DROP NOT NULL;
