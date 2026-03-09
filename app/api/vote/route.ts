import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { voteSchema, formatZodError } from '@/lib/validations';

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip');
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validate request body
    const body = await request.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }
    const { teamId } = parsed.data;

    // 2. Identify voter via browser UUID token
    const voterToken = request.headers.get('x-voter-token');
    if (!voterToken) {
      return NextResponse.json(
        { error: 'Voter token missing. Please refresh the page and try again.' },
        { status: 400 }
      );
    }

    // 3. IP-based duplicate check — catches users who cleared browser cache
    const clientIp = getClientIp(request);
    if (clientIp) {
      const ipVoter = await prisma.voter.findUnique({
        where: { ipAddress: clientIp },
        include: { votes: { take: 1, select: { id: true } } },
      });
      if (ipVoter && ipVoter.votes.length > 0) {
        return NextResponse.json({ error: 'You have already voted.' }, { status: 400 });
      }
    }

    // 4. Find or create voter record by UUID token
    const voter = await prisma.voter.upsert({
      where: { clerkUserId: voterToken },
      create: { clerkUserId: voterToken, ipAddress: clientIp ?? undefined },
      update: { ipAddress: clientIp ?? undefined },
    });

    // 5. Confirm team exists
    const project = await prisma.project.findUnique({
      where: { id: teamId },
      select: { id: true },
    });
    if (!project) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    // 6. Check if voter already voted (token-level guard)
    const existingVote = await prisma.vote.findFirst({
      where: { voterId: voter.id },
      select: { id: true },
    });
    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted.' }, { status: 400 });
    }

    // 7. Record vote and increment counter atomically
    await prisma.$transaction([
      prisma.vote.create({ data: { voterId: voter.id, projectId: teamId } }),
      prisma.project.update({
        where: { id: teamId },
        data: { voteCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(
      { message: 'Your vote has been recorded.' },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'You have already voted.' }, { status: 400 });
    }
    console.error('[POST /api/vote]', error);
    return NextResponse.json({ error: 'Failed to submit vote.' }, { status: 500 });
  }
}
