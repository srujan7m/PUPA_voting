import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const pendingVoteSchema = z.object({
  teamIds: z
    .array(z.number().int().positive())
    .min(1, 'Select at least one team.')
    .max(3, 'You can vote for at most 3 teams.')
    .refine((ids) => new Set(ids).size === ids.length, 'Duplicate team selections.'),
  mobileNumber: z
    .string()
    .regex(/^\+?[6-9][0-9]{9,12}$/, 'Enter a valid 10-digit mobile number.'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = pendingVoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }

    const { teamIds, mobileNumber } = parsed.data;
    const voterToken = request.headers.get('x-voter-token') ?? 'anonymous';

    // Check if this mobile number already has an approved or pending vote
    const existing = await prisma.pendingVote.findFirst({
      where: {
        mobileNumber,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });
    if (existing) {
      const msg =
        existing.status === 'APPROVED'
          ? 'This mobile number has already voted.'
          : 'A vote for this mobile number is already pending admin approval.';
      return NextResponse.json({ error: msg }, { status: 409 });
    }

    // Confirm all selected teams exist
    const projects = await prisma.project.findMany({
      where: { id: { in: teamIds } },
      select: { id: true },
    });
    if (projects.length !== teamIds.length) {
      return NextResponse.json(
        { error: 'One or more selected teams were not found.' },
        { status: 404 }
      );
    }

    // Store vote as pending for admin approval
    const pending = await prisma.pendingVote.create({
      data: {
        mobileNumber,
        teamIds: JSON.stringify(teamIds),
        voterToken,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        message: 'Your vote is pending admin verification. Please show your phone to the admin at the desk.',
        pendingId: pending.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/votes/pending]', error);
    return NextResponse.json({ error: 'Failed to submit vote.' }, { status: 500 });
  }
}
