ALTER TYPE "SourceKind" ADD VALUE 'VIDEO_CREATOR';

ALTER TABLE "Source"
  ADD COLUMN "creatorName" TEXT,
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "timestampSeconds" INTEGER,
  ADD COLUMN "claimSummary" TEXT;

CREATE TABLE "VideoSourceCandidate" (
  "id" TEXT NOT NULL,
  "countrySlug" TEXT,
  "regionSlug" TEXT,
  "citySlug" TEXT,
  "channelName" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3),
  "timestampSeconds" INTEGER,
  "claimSummary" TEXT NOT NULL,
  "status" "WarningStatus" NOT NULL DEFAULT 'REVIEWING',
  "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "VideoSourceCandidate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VideoSourceCandidate_url_key" ON "VideoSourceCandidate"("url");
CREATE INDEX "VideoSourceCandidate_status_countrySlug_idx" ON "VideoSourceCandidate"("status", "countrySlug");
CREATE INDEX "VideoSourceCandidate_channelName_idx" ON "VideoSourceCandidate"("channelName");