import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prismaClient: PrismaClient

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma
} else {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/propertyhub?schema=public'
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  prismaClient = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient
  }
}

export const db = prismaClient
export default db
