import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    const { _count, teamNumber, teamName, demoVideoUrl, imageUrl, voteCount, teamMembers, createdAt, updatedAt, ...rest } = team;
    return NextResponse.json({
      ...rest,
      team_number: teamNumber,
      team_name: teamName,
      team_members: teamMembers,
      demo_video_url: demoVideoUrl,
      image_url: imageUrl,
      vote_count: _count.votes,
    });
  } catch (error) {
    console.error('[GET /api/team/[id]]', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
