import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  neonPool: Pool | undefined;
};

const neonPool =
  globalForPrisma.neonPool ??
  new Pool({
    connectionString,
  });

const adapter = new PrismaNeon(neonPool);

const prismaOptions = {
  adapter: adapter as any,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaOptions as any);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.neonPool = neonPool;
}

export default prisma;
