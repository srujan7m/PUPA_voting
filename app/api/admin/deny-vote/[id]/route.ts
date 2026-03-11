import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const pendingId = parseInt(id, 10);
    if (isNaN(pendingId)) {
      return NextResponse.json({ error: 'Invalid ID.' }, { status: 400 });
    }

    const pending = await prisma.pendingVote.findUnique({ where: { id: pendingId } });
    if (!pending) {
      return NextResponse.json({ error: 'Pending vote not found.' }, { status: 404 });
    }
    if (pending.status !== 'PENDING') {
      return NextResponse.json({ error: `Vote already ${pending.status.toLowerCase()}.` }, { status: 409 });
    }

    await prisma.pendingVote.update({ where: { id: pendingId }, data: { status: 'DENIED' } });

    return NextResponse.json({ message: 'Vote denied.' });
  } catch (error) {
    console.error('[POST /api/admin/deny-vote]', error);
    return NextResponse.json({ error: 'Failed to deny vote.' }, { status: 500 });
  }
}
