ALTER TABLE "Warning" ADD COLUMN "key" TEXT;
ALTER TABLE "Warning" ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Warning" SET "key" = "id" WHERE "key" IS NULL;

ALTER TABLE "Warning" ALTER COLUMN "key" SET NOT NULL;
CREATE UNIQUE INDEX "Warning_key_key" ON "Warning"("key");
CREATE INDEX "Warning_archived_idx" ON "Warning"("archived");