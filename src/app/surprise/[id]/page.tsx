import { notFound } from "next/navigation";
import { getCardById } from "@/lib/db";
import { SurpriseExperience } from "@/components/surprise/SurpriseExperience";

import { Metadata } from 'next';

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const card = await getCardById(params.id);

  if (!card) {
    return {
      title: 'Card Not Found',
      description: 'The surprise you are looking for could not be found.',
    };
  }

  const title = `A Special Surprise For ${card.recipientName}! 🎁`;
  const description = card.senderName 
    ? `${card.senderName} has sent you a beautiful digital greeting card.` 
    : `Someone has sent you a beautiful digital greeting card.`;
    
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: card.photo1Url ? [card.photo1Url] : [
        {
          url: "https://surprise-for-any-occasion-fzg1.vercel.app/chatmi.jpg",
          width: 1200,
          height: 630,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: card.photo1Url ? [card.photo1Url] : ["https://surprise-for-any-occasion-fzg1.vercel.app/chatmi.jpg"],
    },
  };
}

export default async function SurprisePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const card = await getCardById(params.id);

  if (!card) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <SurpriseExperience card={card} />
    </main>
  );
}
