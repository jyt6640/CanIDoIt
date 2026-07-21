import { describe, expect, it } from 'vitest';
import { createSessionToken, verifyCredentials, verifySessionToken } from './session';

const SECRET = '0123456789abcdef0123456789abcdef';
const NOW = Date.UTC(2026, 6, 21, 0, 0, 0);

describe('admin session', () => {
  it('유효한 서명 토큰을 검증한다', () => {
    const token = createSessionToken({ username: 'operator', secret: SECRET, ttlSeconds: 3600, nowMs: NOW });
    expect(verifySessionToken({ token, secret: SECRET, nowMs: NOW + 1000 })).toMatchObject({ sub: 'operator' });
  });

  it('변조되거나 만료된 토큰을 거부한다', () => {
    const token = createSessionToken({ username: 'operator', secret: SECRET, ttlSeconds: 10, nowMs: NOW });
    expect(verifySessionToken({ token: `${token}x`, secret: SECRET, nowMs: NOW })).toBeNull();
    expect(verifySessionToken({ token, secret: SECRET, nowMs: NOW + 11_000 })).toBeNull();
  });

  it('설정된 관리자 자격 증명만 허용한다', () => {
    expect(verifyCredentials({
      username: 'admin',
      password: 'correct-password',
      configuredUsername: 'admin',
      configuredPassword: 'correct-password',
    })).toBe(true);
    expect(verifyCredentials({
      username: 'admin',
      password: 'wrong-password',
      configuredUsername: 'admin',
      configuredPassword: 'correct-password',
    })).toBe(false);
  });
});
