import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 22+의 실험적 global localStorage가 jsdom 구현을 가리는 경우를 방지한다.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: window.localStorage,
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
