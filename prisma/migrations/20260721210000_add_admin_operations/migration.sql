CREATE TYPE "AdminJobType" AS ENUM ('COLLECT_SOURCE', 'DRAFT_CONTENT', 'AUDIT_SOURCE', 'AUDIT_DATABASE');
CREATE TYPE "AdminJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

CREATE TABLE "AdminJob" (
  "id" TEXT NOT NULL,
  "type" "AdminJobType" NOT NULL,
  "status" "AdminJobStatus" NOT NULL DEFAULT 'QUEUED',
  "targetType" TEXT,
  "targetId" TEXT,
  "input" JSONB,
  "output" JSONB,
  "error" TEXT,
  "requestedBy" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminActionLog" (
  "id" TEXT NOT NULL,
  "actor" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminJob_status_createdAt_idx" ON "AdminJob"("status", "createdAt");
CREATE INDEX "AdminJob_type_createdAt_idx" ON "AdminJob"("type", "createdAt");
CREATE INDEX "AdminActionLog_createdAt_idx" ON "AdminActionLog"("createdAt");
CREATE INDEX "AdminActionLog_actor_createdAt_idx" ON "AdminActionLog"("actor", "createdAt");
CREATE INDEX "AdminActionLog_targetType_targetId_idx" ON "AdminActionLog"("targetType", "targetId");