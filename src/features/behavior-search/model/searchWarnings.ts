import type { SavedWarningRecord } from '@/entities/warning/api/warningRepository';

export interface ParsedTravelQuestion {
  country?: string | null;
  city?: string | null;
  actions: string[];
  categories: string[];
  intent: 'ALLOWANCE' | 'RULE' | 'SAFETY' | 'UNKNOWN';
}

export interface SearchHit extends SavedWarningRecord {
  score: number;
}

export const normalizeSearchText = (value: string) =>
  value.toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export function fallbackParseQuestion(question: string): ParsedTravelQuestion {
  const normalized = normalizeSearchText(question);
  const actions = normalized.split(' ').filter((term) => term.length > 1);
  return {
    country: null,
    city: null,
    actions,
    categories: [],
    intent: /해도|가능|돼|되나|허용/.test(question) ? 'ALLOWANCE' : 'UNKNOWN',
  };
}

export function rankWarnings(
  records: SavedWarningRecord[],
  question: string,
  parsed: ParsedTravelQuestion,
  limit = 5,
): SearchHit[] {
  const questionTerms = new Set([
    ...normalizeSearchText(question).split(' '),
    ...parsed.actions.flatMap((value) => normalizeSearchText(value).split(' ')),
    ...parsed.categories.flatMap((value) => normalizeSearchText(value).split(' ')),
  ].filter((term) => term.length > 1));

  return records
    .map((record) => {
      const { warning, country, city } = record;
      const title = normalizeSearchText(warning.title);
      const destination = normalizeSearchText(`${country.name} ${city?.name ?? ''}`);
      const body = normalizeSearchText([
        warning.reason,
        warning.alternative,
        warning.category,
        warning.type,
        ...warning.locations,
        ...(warning.keywords ?? []),
        ...(warning.aliases ?? []),
      ].join(' '));

      let score = 0;
      for (const term of questionTerms) {
        if (title.includes(term)) score += 5;
        if (destination.includes(term)) score += 4;
        if (body.includes(term)) score += 2;
      }
      if (parsed.country && destination.includes(normalizeSearchText(parsed.country))) score += 8;
      if (parsed.city && destination.includes(normalizeSearchText(parsed.city))) score += 8;
      if (warning.status === 'VERIFIED') score += 2;
      if (warning.sources?.some((source) => source.url)) score += 2;
      return { ...record, score };
    })
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
