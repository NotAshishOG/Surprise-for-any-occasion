import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Card {
  id: string;
  senderName?: string;
  recipientName: string;
  message: string;
  occasion: string;
  photo1Url?: string;
  photo2Url?: string;
  audioFileUrl?: string;
  audioLinkUrl?: string;
  signatureText?: string;
  extraPhotoUrls?: string[];
  balloonPhotoUrls?: string[];
  createdAt: string;
}

export async function getCardById(id: string): Promise<Card | undefined> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching card:', error);
    return undefined;
  }

  return data as Card;
}

export async function saveCard(card: Card): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .insert([card]);

  if (error) {
    console.error('Error saving card:', error);
    throw new Error('Failed to save card');
  }
}
