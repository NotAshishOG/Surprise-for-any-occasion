import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        surprise: { select: { slug: true, occasion: true } }
      }
    });

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Surprise Slug', 'Occasion', 'Created At'];
    const rows = leads.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.surprise?.slug || ''}"`,
      `"${l.surprise?.occasion || ''}"`,
      `"${l.createdAt.toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads-export.csv"'
      }
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json({ error: 'Failed to export leads' }, { status: 500 });
  }
}
