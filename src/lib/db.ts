import { prisma } from '@/lib/prisma';

export function isDatabaseConnected(): boolean {
  if (!process.env.DATABASE_URL) return false;
  if (process.env.DATABASE_URL.includes('file:')) return false;
  if (process.env.DATABASE_URL.includes('your-')) return false;
  return true;
}

export async function getDb() {
  return prisma;
}
