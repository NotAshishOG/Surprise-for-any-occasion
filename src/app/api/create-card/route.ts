import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { isRateLimited } from '@/lib/rateLimiter';


function sanitizeInput(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const settings = await db.systemSettings.findUnique({ where: { id: 'global' } });
    if (settings?.maintenanceMode) {
      return NextResponse.json({ error: 'System is currently under maintenance. Card creation is temporarily paused.' }, { status: 503 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip');

    const body = await req.json();
    
    const {
      senderName,
      recipientName,
      message,
      occasion,
      photo1Url,
      photo2Url,
      audioFileUrl,
      audioLink,
      signatureText,
      extraPhotoUrls,
      balloonPhotoUrls,
      userInfo
    } = body;

    if (!recipientName || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }

    const id = uuidv4();
    const cleanMessage = sanitizeInput(message);

    // Map occasion string to enum
    let enumOccasion = 'CUSTOM';
    if (occasion === 'Friendship Day') enumOccasion = 'FRIENDSHIP_DAY';
    if (occasion === 'Birthday') enumOccasion = 'BIRTHDAY';
    if (occasion === 'Anniversary') enumOccasion = 'ANNIVERSARY';
    if (occasion === "Valentine's Day") enumOccasion = 'VALENTINES_DAY';

    let enumNickname = 'OTHER';
    if (recipientName === 'Bestie') enumNickname = 'BESTIE';
    if (recipientName === 'Yaar') enumNickname = 'YAAR';
    if (recipientName === 'Dost') enumNickname = 'DOST';
    if (recipientName === 'Bro') enumNickname = 'BRO';
    if (recipientName === 'Sis') enumNickname = 'SIS';
    if (recipientName === 'Best Friend') enumNickname = 'BEST_FRIEND';

    await db.surprise.create({
      data: {
        id,
        slug: uuidv4().substring(0, 8),
        editToken: uuidv4(),
        occasion: enumOccasion as any,
        customOccasion: enumOccasion === 'CUSTOM' ? String(occasion || '').substring(0, 40) : null,
        recipientNickname: enumNickname as any,
        customNickname: enumNickname === 'OTHER' ? String(recipientName || '').substring(0, 30) : null,
        senderName: String(senderName || 'Someone Special').substring(0, 40),
        message: String(cleanMessage || '').substring(0, 600),
        polaroidCaption: signatureText ? String(signatureText).substring(0, 120) : null,
        musicType: audioFileUrl ? 'UPLOAD' : audioLink ? 'YOUTUBE' : 'NONE',
        youtubeUrl: audioLink || null,
        status: 'PUBLISHED',
        creatorIpHash: String(ip || '127.0.0.1'),
        publishedAt: new Date()
      }
    });

    // Handle media (which is now in a separate table)
    const mediaToCreate = [];
    if (photo1Url) {
      mediaToCreate.push({ surpriseId: id, role: 'POLAROID', url: photo1Url, storageKey: photo1Url, mimeType: 'image/jpeg', sizeBytes: 0 });
    }
    if (photo2Url) {
      mediaToCreate.push({ surpriseId: id, role: 'HERO', url: photo2Url, storageKey: photo2Url, mimeType: 'image/jpeg', sizeBytes: 0 });
    }
    if (audioFileUrl) {
      mediaToCreate.push({ surpriseId: id, role: 'AUDIO', url: audioFileUrl, storageKey: audioFileUrl, mimeType: 'audio/mp3', sizeBytes: 0 });
    }
    if (extraPhotoUrls && Array.isArray(extraPhotoUrls)) {
      extraPhotoUrls.forEach((url: string, i: number) => {
        mediaToCreate.push({ surpriseId: id, role: 'EXTRA', url, position: i, storageKey: url, mimeType: 'image/jpeg', sizeBytes: 0 });
      });
    }
    if (balloonPhotoUrls && Array.isArray(balloonPhotoUrls)) {
      balloonPhotoUrls.forEach((url: string, i: number) => {
        mediaToCreate.push({ surpriseId: id, role: 'BALLOON', url, position: i, storageKey: url, mimeType: 'image/jpeg', sizeBytes: 0 });
      });
    }

    if (mediaToCreate.length > 0) {
      try {
        await Promise.all(mediaToCreate.map((item) => db.mediaAsset.create({ data: item as any })));
      } catch (mediaErr) {
        console.error('Error creating media assets:', mediaErr);
      }
    }

    if (userInfo && userInfo.name && userInfo.email && userInfo.phone) {
      try {
        await db.lead.create({
          data: {
            name: String(userInfo.name).substring(0, 80),
            email: String(userInfo.email).substring(0, 120),
            phone: String(userInfo.phone).substring(0, 30),
            cardId: id
          }
        });
      } catch (leadErr) {
        console.error('Error creating lead:', leadErr);
      }
    }

    return NextResponse.json({ id, url: `/surprise/${id}` });
  } catch (error) {
    console.error('Error creating card:', error);
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
