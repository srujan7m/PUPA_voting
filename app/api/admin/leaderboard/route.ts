import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const teams = await prisma.project.findMany({
      orderBy: [{ voteCount: 'desc' }, { teamNumber: 'asc' }],
      include: { _count: { select: { votes: true } } },
    });
    const totalVotes = await prisma.vote.count();
    const totalPending = await prisma.pendingVote.count({ where: { status: 'PENDING' } });

    const results = teams.map((team, index) => {
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

    return NextResponse.json({ results, totalVotes, totalPending });
  } catch (error) {
    console.error('[GET /api/admin/leaderboard]', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 });
  }
}
