import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sanitizeHtml from 'sanitize-html';
import { saveCard, saveLead } from '@/lib/db';
import { isRateLimited } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

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
    const cleanMessage = sanitizeHtml(message);

    const card = {
      id,
      senderName: senderName || null,
      recipientName,
      message: cleanMessage,
      occasion: occasion || "Friendship Day",
      photo1Url: photo1Url || null,
      photo2Url: photo2Url || null,
      audioFileUrl: audioFileUrl || null,
      audioLinkUrl: audioLink || null,
      signatureText: signatureText || null,
      extraPhotoUrls: extraPhotoUrls?.length > 0 ? extraPhotoUrls : null,
      balloonPhotoUrls: balloonPhotoUrls?.length > 0 ? balloonPhotoUrls : null,
      createdAt: new Date().toISOString()
    };

    await saveCard(card as any);

    if (userInfo && userInfo.name && userInfo.email && userInfo.phone) {
      await saveLead({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        card_id: id
      });
    }

    return NextResponse.json({ id, url: `/surprise/${id}` });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
