import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip');
}

export async function GET(request: NextRequest) {
  try {
    const voterToken = request.headers.get('x-voter-token');
    const clientIp = getClientIp(request);

    let voter = voterToken
      ? await prisma.voter.findUnique({ where: { clerkUserId: voterToken } })
      : null;

    if (!voter && clientIp) {
      voter = await prisma.voter.findUnique({ where: { ipAddress: clientIp } });
    }

    if (!voter) {
      return NextResponse.json({ hasVoted: false, votedTeamIds: [] });
    }

    const votes = await prisma.vote.findMany({
      where: { voterId: voter.id },
      select: {
        projectId: true,
        project: { select: { name: true, teamName: true } },
      },
    });

    if (votes.length === 0) {
      return NextResponse.json({ hasVoted: false, votedTeamIds: [] });
    }

    return NextResponse.json({
      hasVoted: true,
      votedTeamIds: votes.map((v) => v.projectId),
    });
  } catch (error) {
    console.error('[GET /api/votes/status]', error);
    return NextResponse.json({ error: 'Failed to fetch vote status.' }, { status: 500 });
  }
}
