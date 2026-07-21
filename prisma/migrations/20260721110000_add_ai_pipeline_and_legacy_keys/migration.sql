ALTER TABLE "Warning" ADD COLUMN "legacyKeys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "OfficialSource" (
  "id" TEXT NOT NULL,
  "countryCode" TEXT NOT NULL,
  "agencyName" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'en',
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "lastFetchedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OfficialSource_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OfficialSource_url_key" ON "OfficialSource"("url");
CREATE INDEX "OfficialSource_countryCode_enabled_idx" ON "OfficialSource"("countryCode", "enabled");

CREATE TABLE "SourceSnapshot" (
  "id" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "contentHash" TEXT NOT NULL,
  "extractedText" TEXT NOT NULL,
  "changed" BOOLEAN NOT NULL DEFAULT false,
  "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SourceSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SourceSnapshot_sourceId_contentHash_key" ON "SourceSnapshot"("sourceId", "contentHash");
CREATE INDEX "SourceSnapshot_sourceId_fetchedAt_idx" ON "SourceSnapshot"("sourceId", "fetchedAt");

CREATE TABLE "ContentDraft" (
  "id" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "evidence" TEXT NOT NULL,
  "status" "WarningStatus" NOT NULL DEFAULT 'REVIEWING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "ContentDraft_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ContentDraft_status_createdAt_idx" ON "ContentDraft"("status", "createdAt");

ALTER TABLE "SourceSnapshot" ADD CONSTRAINT "SourceSnapshot_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "OfficialSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentDraft" ADD CONSTRAINT "ContentDraft_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "OfficialSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentDraft" ADD CONSTRAINT "ContentDraft_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "SourceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;