import crypto from 'node:crypto';

export interface AdminSessionPayload {
  sub: string;
  exp: number;
}

const secureEqual = (left: string, right: string) => {
  const length = Math.max(left.length, right.length);
  const leftBuffer = Buffer.from(left.padEnd(length, '\0'));
  const rightBuffer = Buffer.from(right.padEnd(length, '\0'));
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const sign = (payload: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url');

export const createSessionToken = ({
  username,
  secret,
  nowMs = Date.now(),
  ttlSeconds,
}: {
  username: string;
  secret: string;
  nowMs?: number;
  ttlSeconds: number;
}) => {
  const payload: AdminSessionPayload = {
    sub: username,
    exp: Math.floor(nowMs / 1000) + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
};

export const verifySessionToken = ({
  token,
  secret,
  nowMs = Date.now(),
}: {
  token: string | undefined;
  secret: string;
  nowMs?: number;
}): AdminSessionPayload | null => {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || !secureEqual(signature, sign(encoded, secret))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as AdminSessionPayload;
    if (!payload.sub || payload.exp <= Math.floor(nowMs / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const verifyCredentials = ({
  username,
  password,
  configuredUsername,
  configuredPassword,
}: {
  username: string;
  password: string;
  configuredUsername: string;
  configuredPassword: string;
}) => secureEqual(username, configuredUsername) && secureEqual(password, configuredPassword);
