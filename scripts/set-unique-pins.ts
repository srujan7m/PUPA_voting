import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomCode(len: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous O/0/I/1
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function main() {
  const teams = await prisma.project.findMany({
    select: { id: true, teamNumber: true },
    orderBy: [{ teamNumber: 'asc' }, { id: 'asc' }],
  });

  const rows: { num: string; pin: string }[] = [];

  for (const team of teams) {
    const num = team.teamNumber ?? team.id;
    const pin = `PUPA-T${String(num).padStart(3, '0')}-${randomCode(5)}`;
    await prisma.project.update({ where: { id: team.id }, data: { editPin: pin } });
    rows.push({ num: String(num).padStart(3, '0'), pin });
  }

  console.log('\n=== TEAM PINs ===');
  console.log('Team #  | PIN');
  console.log('--------|-------------------------');
  for (const r of rows) {
    console.log(`Team ${r.num} | ${r.pin}`);
  }
  console.log(`\nTotal: ${rows.length} teams updated.\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
