CREATE TYPE "ContentAvailability" AS ENUM ('AVAILABLE', 'PARTIAL', 'IN_REVIEW', 'REQUESTED', 'NO_VERIFIED_DATA');

ALTER TABLE "Country"
  ADD COLUMN "priorityScore" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "contentStatus" "ContentAvailability" NOT NULL DEFAULT 'IN_REVIEW',
  ADD COLUMN "prioritySource" TEXT,
  ADD COLUMN "priorityCheckedAt" TIMESTAMP(3);

ALTER TABLE "Region"
  ADD COLUMN "priorityScore" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "contentStatus" "ContentAvailability" NOT NULL DEFAULT 'IN_REVIEW';

ALTER TABLE "City"
  ADD COLUMN "priorityScore" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "contentStatus" "ContentAvailability" NOT NULL DEFAULT 'IN_REVIEW';

CREATE INDEX "Country_priorityScore_idx" ON "Country"("priorityScore");
CREATE INDEX "Region_priorityScore_idx" ON "Region"("priorityScore");
CREATE INDEX "City_priorityScore_idx" ON "City"("priorityScore");