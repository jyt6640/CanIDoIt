ALTER TABLE "SourceSnapshot"
  ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'direct-fetch',
  ADD COLUMN "metadata" JSONB;