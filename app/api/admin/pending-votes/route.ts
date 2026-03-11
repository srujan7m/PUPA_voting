import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const pending = await prisma.pendingVote.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    });

    // Enrich with team names
    const enriched = await Promise.all(
      pending.map(async (p) => {
        const ids: number[] = JSON.parse(p.teamIds);
        const teams = await prisma.project.findMany({
          where: { id: { in: ids } },
          select: { id: true, name: true, teamName: true, teamNumber: true },
        });
        return {
          id: p.id,
          mobileNumber: p.mobileNumber,
          createdAt: p.createdAt,
          teams: teams.map((t) => ({
            id: t.id,
            name: t.name,
            teamName: t.teamName,
            teamNumber: t.teamNumber,
          })),
        };
      })
    );

    return NextResponse.json({ pendingVotes: enriched });
  } catch (error) {
    console.error('[GET /api/admin/pending-votes]', error);
    return NextResponse.json({ error: 'Failed to fetch pending votes.' }, { status: 500 });
  }
}
