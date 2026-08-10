import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteStorageObject } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const { action, surpriseId, status } = await req.json();

    if (!surpriseId) {
      return NextResponse.json({ error: 'Missing surpriseId' }, { status: 400 });
    }

    if (action === 'CHANGE_STATUS') {
      await db.surprise.update({
        where: { id: surpriseId },
        data: { status }
      });
      return NextResponse.json({ success: true, message: `Status updated to ${status}` });
    }

    if (action === 'PERMANENT_DELETE') {
      const surprise = await db.surprise.findUnique({
        where: { id: surpriseId },
        include: { media: true }
      });

      if (surprise) {
        for (const media of surprise.media) {
          if (media.storageKey) {
            await deleteStorageObject(media.storageKey);
          }
        }
        await db.surprise.delete({ where: { id: surpriseId } });
      }
      return NextResponse.json({ success: true, message: 'Card permanently deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Surprise action failed:', error);
    return NextResponse.json({ error: 'Failed to process card action' }, { status: 500 });
  }
}
