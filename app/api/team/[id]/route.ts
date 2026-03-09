import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { teamUpdateSchema, formatZodError } from '@/lib/validations';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    const team = await prisma.project.findUnique({
      where: { id: numericId },
      include: { _count: { select: { votes: true } } },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const { _count, teamNumber, teamName, demoVideoUrl, imageUrl, stallImages, voteCount, teamMembers, editPin, createdAt, updatedAt, ...rest } = team;
    return NextResponse.json({
      ...rest,
      team_number: teamNumber,
      team_name: teamName,
      team_members: teamMembers,
      demo_video_url: demoVideoUrl,
      image_url: imageUrl,
      stall_images: stallImages ? JSON.parse(stallImages) : [],
      vote_count: _count.votes,
    });
  } catch (error) {
    console.error('[GET /api/team/[id]]', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = teamUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { teamName, description, teamMembers, stallImages, editPin, currentPin } = parsed.data;

    // Check if team has a PIN set and validate it
    const existing = await prisma.project.findUnique({
      where: { id: numericId },
      select: { id: true, editPin: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    if (existing.editPin && existing.editPin !== currentPin) {
      return NextResponse.json({ error: 'Incorrect PIN. Please try again.' }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id: numericId },
      data: {
        ...(teamName !== undefined && { teamName }),
        ...(description !== undefined && { description }),
        ...(teamMembers !== undefined && { teamMembers }),
        ...(stallImages !== undefined && { stallImages: JSON.stringify(stallImages) }),
        ...(editPin !== undefined && { editPin }),
      },
    });

    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    console.error('[PATCH /api/team/[id]]', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}
