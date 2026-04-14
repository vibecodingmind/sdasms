export function isDatabaseConnected(): boolean {
  if (!process.env.DATABASE_URL) return false;
  if (process.env.DATABASE_URL.includes('file:')) return false;
  if (process.env.DATABASE_URL.includes('your-')) return false;
  return true;
}

// Lazy Prisma client - only loads when database is actually used
let _prisma: any = null;

export async function getDb() {
  if (!_prisma) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      _prisma = new PrismaClient({
        log: ['error'],
      });
    } catch {
      throw new Error('Prisma client not available - database not configured');
    }
  }
  return _prisma;
}
