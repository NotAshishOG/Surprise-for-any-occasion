import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { uploadToStorage } from '@/lib/storage';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { MediaRole } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const settings = await db.systemSettings.findUnique({ where: { id: 'global' } });
    if (settings?.maintenanceMode) {
      return NextResponse.json({ error: 'System is currently under maintenance. File upload is temporarily disabled.' }, { status: 503 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    
    // Convert to IP hash (or pass directly if we want `checkRateLimit` to do the hashing, 
    // wait, `checkRateLimit` currently expects an ipHash string. Let's hash it here.)
    // We can use a simple hash since we deleted ipHash.ts? Oh, we didn't delete ipHash.ts.
    // Let me import it.
    const { hashIp } = await import('@/lib/ipHash');
    const ipHash = hashIp(ip);

    const isAllowed = await checkRateLimit('upload', ipHash);
    if (!isAllowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await req.formData();
    
    const file = formData.get('file') as File | null;
    const surpriseId = formData.get('surpriseId') as string | null;
    const editToken = formData.get('editToken') as string | null;
    const role = formData.get('role') as string | null;
    const position = parseInt(formData.get('position') as string || '0', 10);

    if (!file || !surpriseId || !editToken || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const surprise = await db.surprise.findUnique({
      where: { id: surpriseId, editToken }
    });

    if (!surprise) {
      return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 });
    }

    if (surprise.status !== 'DRAFT') {
      return NextResponse.json({ error: 'Cannot add media to a published card' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    let mimeType = file.type;
    let width = null;
    let height = null;
    let sizeBytes = buffer.length;

    const MAX_SIZE = 15 * 1024 * 1024;
    if (sizeBytes > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 15MB)' }, { status: 400 });
    }

    // Role limits
    const currentMediaCount = await db.mediaAsset.count({
      where: { surpriseId, role: role as MediaRole }
    });

    if (role === 'HERO' && currentMediaCount >= 1) return NextResponse.json({ error: 'Only 1 HERO image allowed' }, { status: 400 });
    if (role === 'POLAROID' && currentMediaCount >= 1) return NextResponse.json({ error: 'Only 1 POLAROID image allowed' }, { status: 400 });
    if (role === 'AUDIO' && currentMediaCount >= 1) return NextResponse.json({ error: 'Only 1 AUDIO track allowed' }, { status: 400 });
    if (role === 'EXTRA' && currentMediaCount >= 5) return NextResponse.json({ error: 'Max 5 EXTRA images allowed' }, { status: 400 });

    // Process image with Sharp
    if (mimeType.startsWith('image/')) {
      // Auto-rotate based on EXIF, strip EXIF, convert to WebP
      const processedBuffer = await sharp(buffer)
        .rotate() // auto-rotate
        .webp({ quality: 80 }) // convert to webp and compress
        .toBuffer({ resolveWithObject: true });
        
      buffer = Buffer.from(processedBuffer.data);
      mimeType = 'image/webp';
      width = processedBuffer.info.width;
      height = processedBuffer.info.height;
      sizeBytes = processedBuffer.info.size;
    }

    const fileExt = mimeType === 'image/webp' ? 'webp' : file.name.split('.').pop() || 'bin';
    const storageKey = `${role}/${surpriseId}-${nanoid(10)}.${fileExt}`;

    const publicUrl = await uploadToStorage(storageKey, buffer, mimeType);

    const mediaAsset = await db.mediaAsset.create({
      data: {
        surpriseId,
        role: role as MediaRole,
        position,
        storageKey,
        url: publicUrl,
        mimeType,
        sizeBytes,
        width,
        height,
      }
    });

    return NextResponse.json({
      success: true,
      assetId: mediaAsset.id,
      url: publicUrl
    });
  } catch (error) {
    console.error('Error in upload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
