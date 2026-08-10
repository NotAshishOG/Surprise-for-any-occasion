import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteStorageObject } from '@/lib/storage';

export async function GET() {
  return handleCleanup();
}

export async function POST() {
  return handleCleanup();
}

async function handleCleanup() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find media belonging to DRAFT cards older than 24h or REMOVED cards
    const mediaToDelete = await db.mediaAsset.findMany({
      where: {
        OR: [
          { surprise: { status: 'DRAFT', createdAt: { lt: twentyFourHoursAgo } } },
          { surprise: { status: 'REMOVED' } }
        ]
      }
    });

    let deletedMedia = 0;
    for (const media of mediaToDelete) {
      if (media.storageKey) {
        await deleteStorageObject(media.storageKey);
      }
      await db.mediaAsset.delete({ where: { id: media.id } });
      deletedMedia++;
    }

    return NextResponse.json({ success: true, deletedMedia, message: `Cleaned ${deletedMedia} media assets.` });
  } catch (error) {
    console.error('Cleanup job failed:', error);
    return NextResponse.json({ success: false, error: 'Cleanup job failed' }, { status: 500 });
  }
}
