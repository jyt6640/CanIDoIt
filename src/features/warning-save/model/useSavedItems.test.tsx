import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSavedItems } from './useSavedItems';

const KEY = 'hedodwae:saved';

describe('useSavedItems', () => {
  it('초기 상태는 비어 있다', () => {
    const { result } = renderHook(() => useSavedItems());
    expect(result.current.savedItems.size).toBe(0);
  });

  it('toggleSave로 추가/제거된다', () => {
    const { result } = renderHook(() => useSavedItems());
    act(() => result.current.toggleSave('a'));
    expect(result.current.isSaved('a')).toBe(true);
    act(() => result.current.toggleSave('a'));
    expect(result.current.isSaved('a')).toBe(false);
  });

  it('변경 사항이 localStorage에 저장된다', () => {
    const { result } = renderHook(() => useSavedItems());
    act(() => result.current.toggleSave('x'));
    expect(JSON.parse(localStorage.getItem(KEY) ?? '[]')).toContain('x');
  });

  it('localStorage의 기존 값을 마운트 시 복원한다', () => {
    localStorage.setItem(KEY, JSON.stringify(['seed1', 'seed2']));
    const { result } = renderHook(() => useSavedItems());
    expect(result.current.isSaved('seed1')).toBe(true);
    expect(result.current.isSaved('seed2')).toBe(true);
    expect(result.current.savedItems.size).toBe(2);
  });

  it('손상된 localStorage 값은 무시하고 빈 상태로 시작한다', () => {
    localStorage.setItem(KEY, 'not-json');
    const { result } = renderHook(() => useSavedItems());
    expect(result.current.savedItems.size).toBe(0);
  });
});
