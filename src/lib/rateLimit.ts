import { db } from './db';

const rateLimits = {
  draft: 20,
  upload: 60,
  report: 10,
  contact: 5,
  default: 120,
};

export async function checkRateLimit(endpoint: keyof typeof rateLimits, ipHash: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 3600000);
  
  // Clean up old records occasionally (1% chance to run cleanup inline, otherwise handled by cron)
  if (Math.random() < 0.01) {
    await db.requestLog.deleteMany({
      where: { createdAt: { lt: oneHourAgo } }
    }).catch(console.error); // don't block
  }

  const count = await db.requestLog.count({
    where: {
      ipHash,
      endpoint,
      createdAt: { gte: oneHourAgo }
    }
  });

  const limit = rateLimits[endpoint];
  
  if (count >= limit) {
    return false;
  }

  // Log the new request
  await db.requestLog.create({
    data: {
      ipHash,
      endpoint
    }
  });

  return true;
}
