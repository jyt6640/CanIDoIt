import { describe, it, expect } from 'vitest';
import { getRiskStyles } from './risk';

describe('getRiskStyles', () => {
  it('위험도별로 서로 다른 텍스트 색을 반환한다', () => {
    const levels = ['매우 높음', '높음', '보통', '참고'];
    const texts = levels.map((l) => getRiskStyles(l).text);
    expect(new Set(texts).size).toBe(levels.length);
  });

  it('각 위험도에 아이콘 컴포넌트가 있다', () => {
    for (const level of ['매우 높음', '높음', '보통', '참고']) {
      expect(getRiskStyles(level).icon).toBeTypeOf('object');
    }
  });

  it('알 수 없는 위험도는 기본 스타일로 폴백한다', () => {
    const fallback = getRiskStyles('알수없음');
    expect(fallback.text).toBeTruthy();
    expect(fallback.icon).toBeDefined();
  });
});
