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

    // Try to find voter by UUID token first, then fall back to IP.
    // This means even after a cache clear the user still sees "already voted".
    let voter = voterToken
      ? await prisma.voter.findUnique({ where: { clerkUserId: voterToken } })
      : null;

    if (!voter && clientIp) {
      voter = await prisma.voter.findUnique({ where: { ipAddress: clientIp } });
    }

    if (!voter) {
      return NextResponse.json({ hasVoted: false });
    }

    const vote = await prisma.vote.findFirst({
      where: { voterId: voter.id },
      select: {
        projectId: true,
        project: { select: { name: true, teamName: true } },
      },
    });

    if (!vote) {
      return NextResponse.json({ hasVoted: false });
    }

    return NextResponse.json({
      hasVoted: true,
      projectId: vote.projectId,
      projectName: vote.project.teamName ?? vote.project.name,
    });
  } catch (error) {
    console.error('[GET /api/votes/status]', error);
    return NextResponse.json({ error: 'Failed to fetch vote status.' }, { status: 500 });
  }
}
