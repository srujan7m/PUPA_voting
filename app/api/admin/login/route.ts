import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPin, getAdminCookieValue, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string' || !/^\d{6}$/.test(pin)) {
      return NextResponse.json({ error: 'Enter a valid 6-digit PIN.' }, { status: 400 });
    }

    if (!verifyAdminPin(pin)) {
      return NextResponse.json({ error: 'Incorrect PIN.' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Authenticated.' });
    response.cookies.set(ADMIN_COOKIE_NAME, getAdminCookieValue(), {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      // secure: true in production — Next.js handles this automatically on HTTPS
      maxAge: 60 * 60 * 8, // 8-hour session
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
