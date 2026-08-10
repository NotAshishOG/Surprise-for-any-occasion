import { nanoid } from 'nanoid';
import { db } from './db';

export async function generateUniqueSlug(length = 8, maxRetries = 5): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const slug = nanoid(length);
    const existing = await db.surprise.findUnique({
      where: { slug },
      select: { id: true },
    });
    
    if (!existing) {
      return slug;
    }
  }
  throw new Error('Failed to generate a unique slug');
}
