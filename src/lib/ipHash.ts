import { createHmac } from 'crypto';

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET || 'default-dev-secret-do-not-use-in-prod';
  return createHmac('sha256', secret).update(ip).digest('hex');
}
