import 'server-only';

import type { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db/prisma';

export const writeAdminLog = async ({
  actor,
  action,
  targetType,
  targetId,
  metadata,
}: {
  actor: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
}) => {
  await prisma.adminActionLog.create({
    data: {
      actor,
      action,
      targetType,
      targetId: targetId ?? null,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
    },
  });
};
