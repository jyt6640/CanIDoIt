CREATE TYPE "SourceLinkStatus" AS ENUM ('UNKNOWN', 'HEALTHY', 'BLOCKED', 'NOT_FOUND', 'ERROR');

ALTER TABLE "Source"
  ADD COLUMN "linkStatus" "SourceLinkStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "lastLinkCheckedAt" TIMESTAMP(3),
  ADD COLUMN "lastHttpStatus" INTEGER,
  ADD COLUMN "finalUrl" TEXT;

CREATE INDEX "Source_linkStatus_idx" ON "Source"("linkStatus");