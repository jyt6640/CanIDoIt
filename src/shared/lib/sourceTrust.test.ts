import { describe, expect, it } from 'vitest';
import { evaluateSourceTrust, getSourceHostname, isLikelyOfficialHostname } from './sourceTrust';

describe('source trust', () => {
  it('정부 도메인을 공식 도메인으로 분류한다', () => {
    const result = evaluateSourceTrust(
      {
        title: '오사카시 공식 안내',
        url: 'https://www.city.osaka.lg.jp/example',
        checkedAt: '2026-07-18T00:00:00.000Z',
      },
      new Date('2026-07-21T00:00:00.000Z'),
    );
    expect(result.level).toBe('OFFICIAL_DOMAIN');
    expect(result.hostname).toBe('city.osaka.lg.jp');
    expect(result.isStale).toBe(false);
  });

  it('오래 확인하지 않은 출처를 재확인 대상으로 표시한다', () => {
    const result = evaluateSourceTrust(
      {
        title: '정부 안내',
        url: 'https://www.gov.uk/example',
        checkedAt: '2025-01-01T00:00:00.000Z',
      },
      new Date('2026-07-21T00:00:00.000Z'),
    );
    expect(result.isStale).toBe(true);
  });

  it('잘못된 URL을 식별한다', () => {
    expect(getSourceHostname('not a url')).toBeNull();
    expect(isLikelyOfficialHostname('example.com')).toBe(false);
  });

  it('정확히 gov.uk인 루트 도메인도 공식 도메인으로 판정한다', () => {
    expect(isLikelyOfficialHostname('gov.uk')).toBe(true);
  });

  it('커뮤니티 출처를 공식 도메인과 구분한다', () => {
    const result = evaluateSourceTrust(
      {
        title: '여행자 후기',
        url: 'https://www.reddit.com/r/travel/example',
        checkedAt: '2026-07-21T00:00:00.000Z',
        kind: 'COMMUNITY',
      },
      new Date('2026-07-21T00:00:00.000Z'),
    );
    expect(result.level).toBe('COMMUNITY');
    expect(result.label).toBe('여행자 후기');
  });
});
