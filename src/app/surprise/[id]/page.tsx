import { notFound } from "next/navigation";
import { getCardById } from "@/lib/db";
import { SurpriseExperience } from "@/components/surprise/SurpriseExperience";

export const metadata = {
  title: "A Surprise For You! 🎁",
  description: "Someone made a special interactive surprise for you.",
};

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
