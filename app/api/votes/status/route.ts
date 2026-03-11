import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const voterToken = request.headers.get('x-voter-token');
    if (!voterToken) {
      return NextResponse.json({ status: 'none', hasVoted: false, votedTeamIds: [] });
    }

    // Check pending vote status first
    const pending = await prisma.pendingVote.findFirst({
      where: { voterToken, status: { in: ['PENDING', 'APPROVED', 'DENIED'] } },
      orderBy: { createdAt: 'desc' },
    });

    if (pending) {
      if (pending.status === 'PENDING') {
        return NextResponse.json({ status: 'pending', hasVoted: false, votedTeamIds: [] });
      }
      if (pending.status === 'APPROVED') {
        const ids: number[] = JSON.parse(pending.teamIds);
        return NextResponse.json({ status: 'approved', hasVoted: true, votedTeamIds: ids });
      }
      if (pending.status === 'DENIED') {
        // Denied — voter may resubmit
        return NextResponse.json({ status: 'denied', hasVoted: false, votedTeamIds: [] });
      }
    }

    return NextResponse.json({ status: 'none', hasVoted: false, votedTeamIds: [] });
  } catch (error) {
    console.error('[GET /api/votes/status]', error);
    return NextResponse.json({ error: 'Failed to fetch vote status.' }, { status: 500 });
  }
}
