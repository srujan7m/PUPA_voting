import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const teams = await prisma.project.findMany({
      orderBy: [{ teamNumber: 'asc' }, { id: 'asc' }],
      include: { _count: { select: { votes: true } } },
    });

    const data = teams.map((team: (typeof teams)[number]) => {
      const { _count, teamNumber, teamName, demoVideoUrl, imageUrl, voteCount, teamMembers, createdAt, updatedAt, ...rest } = team;
      return {
        ...rest,
        team_number: teamNumber,
        team_name: teamName,
        team_members: teamMembers,
        demo_video_url: demoVideoUrl,
        image_url: imageUrl,
        vote_count: _count.votes,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/teams]', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
