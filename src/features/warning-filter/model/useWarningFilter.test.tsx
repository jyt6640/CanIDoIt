import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { Warning } from '@/entities/warning';
import { useWarningFilter } from './useWarningFilter';

const w = (over: Partial<Warning>): Warning => ({
  id: Math.random().toString(),
  title: '제목',
  category: '대중교통',
  risk: '보통',
  type: '일반',
  range: '전반',
  reason: '이유',
  alternative: '대안',
  locations: ['지하철'],
  ...over,
});

const WARNINGS: Warning[] = [
  w({ id: '1', category: '대중교통', locations: ['지하철', '대중교통'] }),
  w({ id: '2', category: '식당', locations: ['식당'] }),
  w({ id: '3', category: '목욕·온천', locations: ['온천'] }),
];

describe('useWarningFilter', () => {
  it('기본값은 전체이며 모든 항목을 반환한다', () => {
    const { result } = renderHook(() => useWarningFilter(WARNINGS));
    expect(result.current.filteredWarnings).toHaveLength(3);
  });

  it('카테고리로 필터링한다', () => {
    const { result } = renderHook(() => useWarningFilter(WARNINGS));
    act(() => result.current.setActiveCategory('식당'));
    expect(result.current.filteredWarnings.map((x) => x.id)).toEqual(['2']);
  });

  it('장소로 필터링한다', () => {
    const { result } = renderHook(() => useWarningFilter(WARNINGS));
    act(() => result.current.selectLocation('온천'));
    expect(result.current.filteredWarnings.map((x) => x.id)).toEqual(['3']);
  });

  it('장소를 선택하면 카테고리가 전체로 초기화된다', () => {
    const { result } = renderHook(() => useWarningFilter(WARNINGS));
    act(() => result.current.setActiveCategory('식당'));
    act(() => result.current.selectLocation('지하철'));
    expect(result.current.activeCategory).toBe('전체');
    expect(result.current.filteredWarnings.map((x) => x.id)).toEqual(['1']);
  });

  it('resetFilters는 모든 필터를 전체로 되돌린다', () => {
    const { result } = renderHook(() => useWarningFilter(WARNINGS));
    act(() => result.current.setActiveCategory('식당'));
    act(() => result.current.resetFilters());
    expect(result.current.activeCategory).toBe('전체');
    expect(result.current.activeLocation).toBe('전체');
    expect(result.current.filteredWarnings).toHaveLength(3);
  });
});
