import { prisma } from '@/lib/prisma';

export function isDatabaseConnected(): boolean {
  // Always connected with SQLite
  return true;
}

export async function getDb() {
  return prisma;
}
