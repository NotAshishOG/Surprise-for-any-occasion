import { db } from './db';

const rateLimits = {
  draft: 200,
  upload: 1000,
  report: 50,
  contact: 50,
  default: 500,
};

export async function checkRateLimit(endpoint: keyof typeof rateLimits, ipHash: string): Promise<boolean> {
  try {
    const oneHourAgo = new Date(Date.now() - 3600000);
    
    if (Math.random() < 0.01) {
      await db.requestLog.deleteMany({
        where: { createdAt: { lt: oneHourAgo } }
      }).catch(console.error);
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

    await db.requestLog.create({
      data: {
        ipHash,
        endpoint
      }
    }).catch(console.error);

    return true;
  } catch (err) {
    console.error('Error in checkRateLimit:', err);
    return true; // fail open so rate limiting doesn't block users on DB error
  }
}
