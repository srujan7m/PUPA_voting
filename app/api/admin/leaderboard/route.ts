import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getOrSetCache } from '@/lib/server-cache';

const ADMIN_LEADERBOARD_CACHE_KEY = 'api:admin:leaderboard:v1';
const ADMIN_LEADERBOARD_CACHE_TTL_MS = 120_000;

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const payload = await getOrSetCache(ADMIN_LEADERBOARD_CACHE_KEY, ADMIN_LEADERBOARD_CACHE_TTL_MS, async () => {
      const [teams, totalVotesAgg, totalPending] = await Promise.all([
        prisma.project.findMany({
          orderBy: [{ voteCount: 'desc' }, { teamNumber: 'asc' }],
          select: {
            id: true,
            name: true,
            teamName: true,
            teamNumber: true,
            voteCount: true,
          },
        }),
        prisma.project.aggregate({ _sum: { voteCount: true } }),
        prisma.pendingVote.count({ where: { status: 'PENDING' } }),
      ]);

      const results = teams.map((team, index) => {
        const { teamNumber, teamName, voteCount, ...rest } = team;
        return {
          ...rest,
          team_number: teamNumber,
          team_name: teamName,
          vote_count: voteCount,
          rank: index + 1,
        };
      });

      return {
        results,
        totalVotes: totalVotesAgg._sum.voteCount ?? 0,
        totalPending,
      };
    });

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'private, max-age=120, stale-while-revalidate=240',
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/leaderboard]', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 });
  }
}
