import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.project.updateMany({
    data: { editPin: 'PUPA-FINALIST_qw34bh' },
  });
  console.log(`PIN set for ${result.count} teams.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
