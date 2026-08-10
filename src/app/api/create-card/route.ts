import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { generateUniqueSlug } from '@/lib/slug';

function sanitizeInput(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Check maintenance mode
    let settings;
    try {
      settings = await db.systemSettings.findUnique({ where: { id: 'global' } });
    } catch (settingsErr) {
      console.error('[create-card] Step 1 FAILED - systemSettings query:', settingsErr);
      // Non-fatal: proceed without maintenance check
    }
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

    // Step 2: Generate unique slug
    let slug: string;
    try {
      slug = await generateUniqueSlug(8);
    } catch (slugErr) {
      console.error('[create-card] Step 2 FAILED - generateUniqueSlug:', slugErr);
      // Fallback: use a uuid substring (extremely unlikely to collide)
      slug = uuidv4().replace(/-/g, '').substring(0, 8);
    }

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

    // Step 3: Create the surprise record (critical)
    try {
      await db.surprise.create({
        data: {
          id,
          slug,
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
    } catch (createErr) {
      console.error('[create-card] Step 3 FAILED - db.surprise.create:', createErr);
      const msg = createErr instanceof Error ? createErr.message : String(createErr);
      return NextResponse.json({ error: `Database error: ${msg}` }, { status: 500 });
    }

    // Step 4: Handle media (non-fatal)
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
        console.error('[create-card] Step 4 WARNING - media assets:', mediaErr);
      }
    }

    // Step 5: Create lead (non-fatal)
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
        console.error('[create-card] Step 5 WARNING - lead creation:', leadErr);
      }
    }

    return NextResponse.json({ id, url: `/surprise/${id}` });
  } catch (error) {
    console.error('[create-card] UNHANDLED ERROR:', error);
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
