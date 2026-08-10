import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { action, reportId, surpriseId } = await req.json();

    if (action === 'DISMISS') {
      // Mark as safe (delete report record)
      await db.report.delete({ where: { id: reportId } });
      return NextResponse.json({ success: true, message: 'Report dismissed' });
    }

    if (action === 'DELETE_CARD') {
      // Set card status to REMOVED and delete report record
      if (surpriseId) {
        await db.surprise.update({
          where: { id: surpriseId },
          data: { status: 'REMOVED' }
        });
      }
      await db.report.delete({ where: { id: reportId } });
      return NextResponse.json({ success: true, message: 'Card removed and report resolved' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Report action failed:', error);
    return NextResponse.json({ error: 'Failed to process report action' }, { status: 500 });
  }
}
