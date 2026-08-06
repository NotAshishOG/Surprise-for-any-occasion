import fs from 'fs';
import path from 'path';

// Using process.cwd() ensures it works when run from project root
const DB_PATH = path.join(process.cwd(), 'data', 'cards.json');

// Global lock to prevent race conditions during concurrent saves
let dbLock = Promise.resolve();

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

// Helper to ensure file exists
function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf-8');
  }
}

export function getAllCards(): Card[] {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read db:', error);
    return [];
  }
}

export function getCardById(id: string): Card | undefined {
  const cards = getAllCards();
  return cards.find((c) => c.id === id);
}

export async function saveCard(card: Card): Promise<void> {
  const release = await new Promise<() => void>((resolve) => {
    const previous = dbLock;
    dbLock = previous.then(() => {
      resolve(() => {});
    });
  });

  try {
    const cards = getAllCards();
    cards.push(card);
    fs.writeFileSync(DB_PATH, JSON.stringify(cards, null, 2), 'utf-8');
  } finally {
    release();
  }
}
