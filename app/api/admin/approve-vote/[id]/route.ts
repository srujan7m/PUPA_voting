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

    // Double-check the mobile number hasn't been approved in the meantime
    const alreadyApproved = await prisma.pendingVote.findFirst({
      where: { mobileNumber: pending.mobileNumber, status: 'APPROVED', id: { not: pendingId } },
    });
    if (alreadyApproved) {
      await prisma.pendingVote.update({ where: { id: pendingId }, data: { status: 'DENIED' } });
      return NextResponse.json({ error: 'This mobile number has already voted.' }, { status: 409 });
    }

    const teamIds: number[] = JSON.parse(pending.teamIds);

    // Find or create voter record using voterToken
    const voter = await prisma.voter.upsert({
      where: { clerkUserId: pending.voterToken },
      create: { clerkUserId: pending.voterToken },
      update: {},
    });

    // Check voter hasn't already voted (safety guard)
    const existingVote = await prisma.vote.findFirst({ where: { voterId: voter.id } });
    if (existingVote) {
      await prisma.pendingVote.update({ where: { id: pendingId }, data: { status: 'DENIED' } });
      return NextResponse.json({ error: 'This voter has already voted.' }, { status: 409 });
    }

    // Commit votes atomically and mark pending as approved
    await prisma.$transaction([
      ...teamIds.map((tid) => prisma.vote.create({ data: { voterId: voter.id, projectId: tid } })),
      ...teamIds.map((tid) =>
        prisma.project.update({ where: { id: tid }, data: { voteCount: { increment: 1 } } })
      ),
      prisma.pendingVote.update({ where: { id: pendingId }, data: { status: 'APPROVED' } }),
    ]);

    return NextResponse.json({ message: 'Vote approved and recorded.' });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate vote detected.' }, { status: 409 });
    }
    console.error('[POST /api/admin/approve-vote]', error);
    return NextResponse.json({ error: 'Failed to approve vote.' }, { status: 500 });
  }
}
