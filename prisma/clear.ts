import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing voter data and team details...');

  await prisma.$transaction([
    prisma.vote.deleteMany(),
    prisma.pendingVote.deleteMany(),
    prisma.voter.deleteMany(),
    prisma.project.updateMany({
      data: {
        description: null,
        teamName: null,
        teamMembers: null,
        demoVideoUrl: null,
        imageUrl: null,
        stallImages: null,
        editPin: null,
        voteCount: 0,
      },
    }),
  ]);

  const projectCount = await prisma.project.count();
  console.log(`Done. Cleared data for ${projectCount} teams.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
