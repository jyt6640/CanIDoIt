CREATE TYPE "WarningStatus" AS ENUM ('DRAFT', 'REVIEWING', 'VERIFIED', 'STALE', 'ARCHIVED');

ALTER TABLE "Warning"
  ADD COLUMN "status" "WarningStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "verifiedAt" TIMESTAMP(3),
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "reviewedBy" TEXT,
  ADD COLUMN "confidence" INTEGER;

UPDATE "Warning"
SET "status" = CASE
  WHEN EXISTS (SELECT 1 FROM "Source" WHERE "Source"."warningId" = "Warning"."id") THEN 'VERIFIED'::"WarningStatus"
  ELSE 'REVIEWING'::"WarningStatus"
END;

CREATE INDEX "Warning_status_idx" ON "Warning"("status");