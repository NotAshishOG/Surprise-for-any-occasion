import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.systemSettings.findUnique({
      where: { id: 'global' }
    });

    if (!settings) {
      settings = await db.systemSettings.create({
        data: { id: 'global' }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const settings = await db.systemSettings.upsert({
      where: { id: 'global' },
      update: {
        websiteName: body.websiteName || 'Special Surprise',
        supportEmail: body.supportEmail || 'supportchatmiai@gmail.com',
        autoDeleteEnabled: Boolean(body.autoDeleteEnabled),
        leadCollectionEnabled: Boolean(body.leadCollectionEnabled),
        maintenanceMode: Boolean(body.maintenanceMode),
        analyticsEnabled: Boolean(body.analyticsEnabled),
        maxUploadSizeMb: Number(body.maxUploadSizeMb) || 15,
        maxHeroImages: Number(body.maxHeroImages) || 1,
        maxPolaroidImages: Number(body.maxPolaroidImages) || 1,
        maxBalloons: Number(body.maxBalloons) || 3,
        maxExtraImages: Number(body.maxExtraImages) || 5,
        maxAudio: Number(body.maxAudio) || 1,
        privacyText: body.privacyText || null,
        termsText: body.termsText || null,
      },
      create: {
        id: 'global',
        websiteName: body.websiteName || 'Special Surprise',
        supportEmail: body.supportEmail || 'supportchatmiai@gmail.com',
        autoDeleteEnabled: Boolean(body.autoDeleteEnabled),
        leadCollectionEnabled: Boolean(body.leadCollectionEnabled),
        maintenanceMode: Boolean(body.maintenanceMode),
        analyticsEnabled: Boolean(body.analyticsEnabled),
        maxUploadSizeMb: Number(body.maxUploadSizeMb) || 15,
        maxHeroImages: Number(body.maxHeroImages) || 1,
        maxPolaroidImages: Number(body.maxPolaroidImages) || 1,
        maxBalloons: Number(body.maxBalloons) || 3,
        maxExtraImages: Number(body.maxExtraImages) || 5,
        maxAudio: Number(body.maxAudio) || 1,
        privacyText: body.privacyText || null,
        termsText: body.termsText || null,
      }
    });

    return NextResponse.json({ success: true, settings, message: 'Settings saved successfully!' });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
