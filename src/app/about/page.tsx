import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function AboutUs() {
  return (
    <main className="min-h-screen relative pt-12 px-6">
      <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 rounded-2xl relative z-10 font-sans">
        <Link href="/" className="inline-block mb-6 font-bold font-sans hover:-translate-x-1 hover:text-[#EF476F] transition-all absolute top-8 left-8">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-handwriting mb-8 text-center border-b-4 border-black pb-4">About Us</h1>
        
        <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-black mb-4">Our Mission</h2>
            <p className="mb-4">
              At Chatmi AI, our mission is to make expressing emotions fun, easy, and unforgettable. 
              We believe that in a fast-paced digital world, taking a moment to create a personalized, thoughtful surprise card can bring immense joy to both the sender and the receiver.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">The Story</h2>
            <p className="mb-4">
              It all started with a simple idea: why are digital greeting cards so boring? We wanted to create a platform that allows you to bundle your favorite memories, customized messages, and the perfect soundtrack into a delightful, interactive experience.
            </p>
            <p>
              Whether it&apos;s Friendship Day, a birthday, an anniversary, or just a random Tuesday to tell someone you care, our Surprise Card Creator is designed with a playful aesthetic to bring a smile to anyone&apos;s face.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">Who We Are</h2>
            <p>
              We are a passionate team of developers and designers, proudly building products from India 🇮🇳. 
              Created by NotAshishOG, this project reflects our love for creative web design, bold typography, and user-centric experiences. 
              We are continuously iterating and improving the platform to give you the best tools to spread happiness.
            </p>
          </section>

          <section className="bg-[#FFD166]/20 border-2 border-black rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-black mb-2 text-center">Join the Community</h2>
            <p className="text-center mb-6">Connect with us on Discord, share your ideas, or just drop by to say hello!</p>
            <div className="flex justify-center">
              <a href="https://discord.gg/UsdefHvkq4" target="_blank" rel="noopener noreferrer" className="bg-[#5B21B6] text-white px-6 py-3 rounded-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                Join our Discord
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
