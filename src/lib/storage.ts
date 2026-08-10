import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'surprises';

export async function uploadToStorage(path: string, fileBuffer: Buffer, mimeType: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return publicData.publicUrl;
}

export async function deleteStorageObject(path: string) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) {
    console.error('Failed to delete object from Supabase storage:', error);
    return false;
  }
  return true;
}
