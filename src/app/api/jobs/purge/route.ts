import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteStorageObject } from '@/lib/storage';

export async function GET() {
  return handlePurge();
}

export async function POST() {
  return handlePurge();
}

async function handlePurge() {
  try {
    // Find all REMOVED status surprises
    const removedSurprises = await db.surprise.findMany({
      where: { status: 'REMOVED' },
      include: { media: true }
    });

    let purgedCards = 0;
    for (const surprise of removedSurprises) {
      // Delete media from storage
      for (const media of surprise.media) {
        if (media.storageKey) {
          await deleteStorageObject(media.storageKey);
        }
      }
      // Delete surprise (cascade deletes media, leads, reports in database)
      await db.surprise.delete({ where: { id: surprise.id } });
      purgedCards++;
    }

    return NextResponse.json({ success: true, purgedCards, message: `Purged ${purgedCards} cards.` });
  } catch (error) {
    console.error('Purge job failed:', error);
    return NextResponse.json({ success: false, error: 'Purge job failed' }, { status: 500 });
  }
}
