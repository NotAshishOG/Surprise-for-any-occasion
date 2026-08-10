import { db } from "@/lib/db";
import { HeroSection } from "@/components/HeroSection";
import { CardForm } from "@/components/CardForm";
import { SiteGuideChatbot } from "@/components/SiteGuideChatbot";
import { Footer } from "@/components/Footer";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await db.systemSettings.findUnique({
    where: { id: 'global' }
  });

  const isMaintenance = settings?.maintenanceMode ?? false;

  return (
    <main className="min-h-screen relative">
      <HeroSection />
      
      <div className="px-4">
        {isMaintenance ? (
          <div className="max-w-3xl mx-auto my-12 p-8 bg-[#FFE08A] border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative z-10">
            <div className="text-6xl mb-4">🛠️</div>
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4 text-gray-900">
              System Maintenance Underway
            </h2>
            <p className="text-lg md:text-xl font-medium text-gray-800 max-w-xl mx-auto mb-6 leading-relaxed">
              We are currently performing scheduled maintenance and performance upgrades. New surprise card creation is temporarily paused, but existing cards remain fully accessible!
            </p>
            <div className="inline-block px-6 py-2 bg-black text-white font-bold rounded-full text-sm">
              Please check back soon 💖
            </div>
          </div>
        ) : (
          <CardForm />
        )}
      </div>

      <SiteGuideChatbot />
      <Footer />
    </main>
  );
}
