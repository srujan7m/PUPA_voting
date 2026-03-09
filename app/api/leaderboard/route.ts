import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const teams = await prisma.project.findMany({
      orderBy: [{ voteCount: 'desc' }, { teamNumber: 'asc' }],
      include: { _count: { select: { votes: true } } },
    });
    const totalVotes = await prisma.vote.count();

    const results = teams.map((team: (typeof teams)[number], index: number) => {
      const { _count, teamNumber, teamName, demoVideoUrl, imageUrl, voteCount, teamMembers, createdAt, updatedAt, ...rest } = team;
      return {
        ...rest,
        team_number: teamNumber,
        team_name: teamName,
        team_members: teamMembers,
        demo_video_url: demoVideoUrl,
        image_url: imageUrl,
        vote_count: _count.votes,
        rank: index + 1,
      };
    });

    return NextResponse.json({ results, totalVotes });
  } catch (error) {
    console.error('[GET /api/leaderboard]', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 });
  }
}
