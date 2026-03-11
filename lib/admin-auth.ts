import crypto from 'crypto';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'pupa_admin';

function getAdminToken(): string {
  const pin = process.env.ADMIN_PIN ?? '000000';
  const secret = process.env.ADMIN_SECRET ?? 'pupa-admin-secret-2026';
  return crypto.createHmac('sha256', secret).update(pin).digest('hex');
}

export function verifyAdminPin(pin: string): boolean {
  const expected = process.env.ADMIN_PIN ?? '000000';
  // Constant-time comparison to prevent timing attacks
  if (pin.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(pin), Buffer.from(expected));
}

export function getAdminCookieValue(): string {
  return getAdminToken();
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie) return false;
  const expected = getAdminToken();
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookie.value, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME };
