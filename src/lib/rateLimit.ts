import { db } from './db';

const rateLimits = {
  draft: 200,
  upload: 1000,
  report: 50,
  contact: 50,
  default: 500,
};

export async function checkRateLimit(endpoint: keyof typeof rateLimits, ipHash: string): Promise<boolean> {
  return true;
}
