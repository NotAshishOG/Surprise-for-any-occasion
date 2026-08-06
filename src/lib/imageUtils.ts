import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  // Do not compress GIFs as it strips animation frames
  if (file.type === 'image/gif') {
    return file;
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Return original if compression fails
  }
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}
