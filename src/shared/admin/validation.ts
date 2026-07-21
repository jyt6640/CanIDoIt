import 'server-only';

import type { RiskLevel, SourceKind, WarningStatus } from '@prisma/client';

export const WARNING_STATUSES: WarningStatus[] = ['DRAFT', 'REVIEWING', 'VERIFIED', 'STALE', 'ARCHIVED'];
export const RISK_LEVELS: RiskLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'];
export const SOURCE_KINDS: SourceKind[] = [
  'OFFICIAL',
  'GOVERNMENT_ADVISORY',
  'COMMUNITY',
  'WIKI',
  'EDITORIAL',
  'VIDEO_CREATOR',
];

export const readRequiredString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  if (typeof value !== 'string' || !value.trim()) throw new Error(`MISSING_${key.toUpperCase()}`);
  return value.trim();
};

export const readOptionalString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

export const readInteger = (formData: FormData, key: string, min: number, max: number) => {
  const raw = formData.get(key);
  if (typeof raw !== 'string') return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null;
  return parsed;
};

export const readEnum = <T extends string>(formData: FormData, key: string, values: readonly T[]) => {
  const raw = formData.get(key);
  if (typeof raw !== 'string' || !values.includes(raw as T)) throw new Error(`INVALID_${key.toUpperCase()}`);
  return raw as T;
};

export const safeReturnPath = (value: FormDataEntryValue | null, fallback: string) => {
  if (typeof value !== 'string' || !value.startsWith('/admin/')) return fallback;
  return value;
};
