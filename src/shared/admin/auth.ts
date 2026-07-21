import 'server-only';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSessionToken, verifyCredentials, verifySessionToken } from './session';
import { adminCookieName, adminSessionTtlSeconds } from './auth-constants';

const getSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be configured with at least 32 characters.');
  }
  return secret;
};

export const createAdminSessionToken = (username: string) => {
  return createSessionToken({
    username,
    secret: getSecret(),
    ttlSeconds: adminSessionTtlSeconds,
  });
};

export const verifyAdminSessionToken = (token: string | undefined) => {
  if (!token) return null;
  return verifySessionToken({ token, secret: getSecret() });
};

export const verifyAdminCredentials = (username: string, password: string) => {
  const configuredUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;

  return verifyCredentials({ username, password, configuredUsername, configuredPassword });
};

export const setAdminSessionCookie = async (username: string) => {
  const store = await cookies();
  store.set(adminCookieName, createAdminSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: adminSessionTtlSeconds,
  });
};

export const clearAdminSessionCookie = async () => {
  const store = await cookies();
  store.set(adminCookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
};

export const getAdminSession = async () => {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(adminCookieName)?.value);
};

export const requireAdmin = async () => {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
};

export const assertAdminApi = async () => {
  const session = await getAdminSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
};

export const assertSameOrigin = async () => {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  const host = requestHeaders.get('host');
  if (!origin || !host) {
    if (process.env.NODE_ENV === 'production') throw new Error('INVALID_ORIGIN');
    return;
  }
  const originHost = new URL(origin).host;
  if (originHost !== host) throw new Error('INVALID_ORIGIN');
};

