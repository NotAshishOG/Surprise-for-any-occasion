import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
  migrate: {
    adapter: async () => {
      const { Pool } = await import('pg')
      const { PrismaPg } = await import('@prisma/adapter-pg')

      const connectionString =
        process.env.DIRECT_URL ||
        process.env.DATABASE_URL ||
        ''

      const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
      })

      return new PrismaPg(pool)
    },
  },
})

