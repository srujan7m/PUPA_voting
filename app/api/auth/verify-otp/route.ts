import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ error: 'This endpoint has been deprecated. Please use Clerk authentication.' }, { status: 410 });
}
