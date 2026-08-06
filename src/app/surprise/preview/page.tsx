import { SurpriseExperience } from "@/components/surprise/SurpriseExperience";

export default function PreviewPage() {
  const previewCard = {
    id: "preview-id",
    senderName: "The Joy Team",
    recipientName: "Demo User",
    message: "Wishing you the best birthday ever! Hope all your dreams come true and you have a wonderful year ahead.",
    photo1Url: "/images/best_friends.png", // Cute friends photo
    photo2Url: "/images/friends_sunset.png", // Sunset friendship
    extraPhotoUrls: [
      "/images/best_friends.png",
      "/images/friends_sunset.png"
    ],
    audioLinkUrl: "https://www.youtube.com/watch?v=4tPJPE4uOEo", // User requested song
    signatureText: "designs by joy",
    occasion: "Happy Friendship Day",
    createdAt: new Date().toISOString()
  };

  return (
    <main className="min-h-screen">
      <SurpriseExperience card={previewCard} />
    </main>
  );
}
