import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'isomorphic-dompurify'; // using isomorphic-dompurify for server-side
import { saveCard } from '@/lib/db';
import { isRateLimited } from '@/lib/rateLimiter';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await req.formData();
    const senderName = formData.get('senderName') as string;
    const recipientName = formData.get('recipientName') as string;
    const message = formData.get('message') as string;
    const photo1 = formData.get('photo1') as File | null;
    const photo2 = formData.get('photo2') as File | null;
    const audioFile = formData.get('audioFile') as File | null;
    const audioLink = formData.get('audioLink') as string | null;
    const signatureText = formData.get('signatureText') as string | null;

    if (!recipientName || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }

    const id = uuidv4();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', id);
    
    let photo1Url = undefined;
    let photo2Url = undefined;
    let audioFileUrl = undefined;
    const audioLinkUrl = audioLink || undefined;
    const extraPhotoUrls: string[] = [];
    const balloonPhotoUrls: string[] = [];

    const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ALLOWED_AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.m4a'];

    const isValidExtension = (filename: string, allowedExts: string[]) => {
      const ext = path.extname(filename).toLowerCase();
      return allowedExts.includes(ext);
    };

    // Helper to save a file
    const saveFile = async (file: File, filename: string): Promise<string> => {
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Basic sanitize filename to prevent directory traversal
        const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(uploadDir, safeFilename);
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${id}/${safeFilename}`;
      } catch (err) {
        console.error("Error saving file:", err);
        throw new Error("Failed to save file");
      }
    };

    if (photo1 && photo1.size > 0) {
      if (!photo1.type.startsWith('image/') || !isValidExtension(photo1.name, ALLOWED_IMAGE_EXTS)) return NextResponse.json({ error: 'Photo 1 must be a valid image (jpg, png, webp, gif)' }, { status: 400 });
      if (photo1.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Photo 1 too large' }, { status: 400 });
      photo1Url = await saveFile(photo1, `photo1-${photo1.name}`);
    }

    if (photo2 && photo2.size > 0) {
      if (!photo2.type.startsWith('image/') || !isValidExtension(photo2.name, ALLOWED_IMAGE_EXTS)) return NextResponse.json({ error: 'Photo 2 must be a valid image (jpg, png, webp, gif)' }, { status: 400 });
      if (photo2.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Photo 2 too large' }, { status: 400 });
      photo2Url = await saveFile(photo2, `photo2-${photo2.name}`);
    }

    if (audioFile && audioFile.size > 0) {
      if (!audioFile.type.startsWith('audio/') || !isValidExtension(audioFile.name, ALLOWED_AUDIO_EXTS)) return NextResponse.json({ error: 'Audio must be a valid audio file (mp3, wav, ogg, m4a)' }, { status: 400 });
      if (audioFile.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Audio file too large' }, { status: 400 });
      audioFileUrl = await saveFile(audioFile, `audio-${audioFile.name}`);
    }

    // Handle extra gallery photos
    const extraPhotos = formData.getAll('extraPhotos') as File[];
    for (let i = 0; i < extraPhotos.length && i < 4; i++) {
      const ep = extraPhotos[i];
      if (ep && ep.size > 0) {
        if (!ep.type.startsWith('image/') || !isValidExtension(ep.name, ALLOWED_IMAGE_EXTS)) continue; // skip non-images
        if (ep.size > 5 * 1024 * 1024) continue; // skip oversized
        const url = await saveFile(ep, `extra-${i}-${ep.name}`);
        extraPhotoUrls.push(url);
      }
    }

    // Handle balloon photos
    const balloonPhotos = formData.getAll('balloonPhotos') as File[];
    for (let i = 0; i < balloonPhotos.length && i < 6; i++) {
      const bp = balloonPhotos[i];
      if (bp && bp.size > 0) {
        if (!bp.type.startsWith('image/') || !isValidExtension(bp.name, ALLOWED_IMAGE_EXTS)) continue;
        if (bp.size > 5 * 1024 * 1024) continue;
        const url = await saveFile(bp, `balloon-${i}-${bp.name}`);
        balloonPhotoUrls.push(url);
      }
    }

    // Sanitize message to prevent XSS
    const cleanMessage = DOMPurify.sanitize(message);

    const card = {
      id,
      senderName,
      recipientName,
      message: cleanMessage,
      occasion: formData.get("occasion") as string || "Friendship Day",
      photo1Url,
      photo2Url,
      audioFileUrl,
      audioLinkUrl,
      signatureText: signatureText || undefined,
      extraPhotoUrls: extraPhotoUrls.length > 0 ? extraPhotoUrls : undefined,
      balloonPhotoUrls: balloonPhotoUrls.length > 0 ? balloonPhotoUrls : undefined,
      createdAt: new Date().toISOString()
    };

    await saveCard(card);

    return NextResponse.json({ id, url: `/surprise/${id}` });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
