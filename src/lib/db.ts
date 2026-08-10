import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Use DIRECT_URL (port 5432, no PgBouncer) to avoid prepared statement
// incompatibility with PgBouncer transaction mode.
// Falls back to DATABASE_URL if DIRECT_URL is not set.
let cachedDb: PrismaClient | undefined;

export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!cachedDb) {
      try {
        const connectionString =
          process.env.DIRECT_URL ||
          process.env.DATABASE_URL ||
          'postgresql://postgres.lijewgyrfpzmfojcwxlj:%26%3F3Qj%2F*AUjCrfkE@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

        const pool = new Pool({
          connectionString,
          ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
            ? false
            : { rejectUnauthorized: false },
          max: 5,
          idleTimeoutMillis: 20000,
          connectionTimeoutMillis: 10000,
        });

        pool.on('error', (err) => {
          console.error('Unexpected pg Pool error:', err);
        });

        const adapter = new PrismaPg(pool);
        cachedDb = new PrismaClient({ adapter });
      } catch (err) {
        console.error('Failed to initialize Prisma Client:', err);
        throw err;
      }
    }
    return (cachedDb as any)[prop];
  }
});

declare global {
  var prismaGlobal: undefined | PrismaClient;
}


if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
