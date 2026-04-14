import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export function isDatabaseConnected(): boolean {
  // Only use database if DATABASE_URL is explicitly set and points to a real DB
  if (!process.env.DATABASE_URL) return false;
  if (process.env.DATABASE_URL.includes('file:')) return false;
  if (process.env.DATABASE_URL.includes('your-')) return false;
  return true;
}
