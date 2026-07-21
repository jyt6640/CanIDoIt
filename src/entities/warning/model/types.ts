export interface WarningSource {
  title: string;
  url?: string | null;
  checkedAt?: string | null;
}

export interface Warning {
  id: string;
  title: string;
  category: string;
  risk: string;
  type: string;
  range: string;
  reason: string;
  alternative: string;
  diffFromKorea?: string | null;
  checkNeeded?: string | null;
  locations: string[];
  keywords?: string[];
  aliases?: string[];
  legacyKeys?: string[];
  sources?: WarningSource[];
  status?: 'DRAFT' | 'REVIEWING' | 'VERIFIED' | 'STALE' | 'ARCHIVED';
  verifiedAt?: string | null;
  expiresAt?: string | null;
  reviewedBy?: string | null;
  confidence?: number | null;
}
