CREATE TABLE "SyncProfile" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "warningKeys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "notifyChanges" BOOLEAN NOT NULL DEFAULT false,
  "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SyncProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SyncProfile_token_key" ON "SyncProfile"("token");