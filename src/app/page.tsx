import { HeroSection } from "@/components/HeroSection";
import { CardForm } from "@/components/CardForm";
import { SiteGuideChatbot } from "@/components/SiteGuideChatbot";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <HeroSection />
      <div className="px-4">
        <CardForm />
      </div>
      <SiteGuideChatbot />
      <Footer />
    </main>
  );
}
