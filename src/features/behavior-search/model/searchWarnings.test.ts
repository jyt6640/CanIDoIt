import { describe, expect, it } from 'vitest';
import { fallbackParseQuestion, rankWarnings } from './searchWarnings';
import type { SavedWarningRecord } from '@/entities/warning/api/warningRepository';

const record = (title: string, country: string, key: string): SavedWarningRecord => ({
  country: { name: country, slug: country.toLowerCase() },
  city: null,
  warning: {
    id: key,
    title,
    category: '법률·안전',
    risk: '매우 높음',
    type: '규정',
    range: country,
    reason: `${title} 관련 공식 규정`,
    alternative: '공식 안내를 확인하세요.',
    locations: ['공항·세관'],
    status: 'VERIFIED',
    sources: [{ title: '공식 출처', url: 'https://example.gov' }],
  },
});

describe('behavior search ranking', () => {
  it('질문의 핵심 행동과 국가가 일치하는 경고를 우선한다', () => {
    const records = [
      record('전자담배를 반입하지 마세요', '태국', 'thailand-vape'),
      record('온천에서 수건을 물에 넣지 마세요', '일본', 'japan-onsen'),
    ];
    const parsed = fallbackParseQuestion('태국에 전자담배 가져가도 돼?');
    expect(rankWarnings(records, '태국에 전자담배 가져가도 돼?', parsed)[0]?.warning.id).toBe('thailand-vape');
  });
});