import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Skip static assets so files under public/ (including /uploads) are served directly.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads/|.*\\..*).*)'],
};
