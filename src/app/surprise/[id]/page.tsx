import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SurpriseExperience } from "@/components/surprise/SurpriseExperience";
import { Metadata } from 'next';

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const card = await db.surprise.findUnique({
    where: { id: params.id },
    include: { media: true }
  });

  if (!card) {
    return {
      title: 'Card Not Found',
      description: 'The surprise you are looking for could not be found.',
    };
  }

  const title = `A Special Surprise For ${card.recipientNickname === 'OTHER' ? card.customNickname : card.recipientNickname}! 🎁`;
  const description = card.senderName 
    ? `${card.senderName} has sent you a beautiful digital greeting card.` 
    : `Someone has sent you a beautiful digital greeting card.`;
    
  const heroMedia = card.media.find(m => m.role === 'HERO');
  const imageUrl = heroMedia?.url || "https://surprise-for-any-occasion-fzg1.vercel.app/chatmi.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SurprisePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const card = await db.surprise.findUnique({
    where: { id: params.id },
    include: { media: true }
  });

  if (!card) {
    notFound();
  }

  // Increment view count
  await db.surprise.update({
    where: { id: card.id },
    data: { 
      viewCount: { increment: 1 },
      lastViewedAt: new Date()
    }
  });

  // Map the Prisma model back to the format expected by SurpriseExperience component
  const mappedCard = {
    id: card.id,
    senderName: card.senderName,
    recipientName: card.recipientNickname === 'OTHER' ? card.customNickname : card.recipientNickname,
    message: card.message,
    occasion: card.occasion === 'CUSTOM' ? card.customOccasion : card.occasion,
    photo1Url: card.media.find(m => m.role === 'POLAROID')?.url || null,
    photo2Url: card.media.find(m => m.role === 'HERO')?.url || null,
    audioFileUrl: card.media.find(m => m.role === 'AUDIO')?.url || null,
    audioLinkUrl: card.youtubeUrl,
    signatureText: card.polaroidCaption,
    extraPhotoUrls: card.media.filter(m => m.role === 'EXTRA').sort((a,b)=>a.position - b.position).map(m => m.url),
    balloonPhotoUrls: card.media.filter(m => m.role === 'BALLOON').sort((a,b)=>a.position - b.position).map(m => m.url),
  };

  return (
    <main className="min-h-screen">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SurpriseExperience card={mappedCard as any} />
    </main>
  );
}
