import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function Support() {
  return (
    <div className="min-h-screen bg-bg-warm flex flex-col font-inter">
      {/* Navigation Bar */}
      <nav className="w-full py-6 px-8 flex justify-between items-center bg-white/50 backdrop-blur-md border-b-4 border-black relative z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/chatmi.jpg" alt="Chatmi AI" className="w-10 h-10 rounded-lg group-hover:scale-105 transition-transform" />
          <span className="font-sans font-bold text-2xl tracking-tight text-gray-900 group-hover:text-[#EF476F] transition-colors">
            CHATMI AI
          </span>
        </Link>
        <div className="flex gap-6 font-semibold">
          <Link href="/" className="hover:text-[#EF476F] transition-colors">Home</Link>
          <Link href="/faq" className="hover:text-[#EF476F] transition-colors">FAQ</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">How can we help?</h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Our support team is available around the clock to help you with any issues, questions, or feedback you might have.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Email Support Card */}
          <div className="bg-white border-4 border-black rounded-3xl p-8 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <div className="w-20 h-20 bg-[#EF476F]/10 rounded-full flex items-center justify-center text-[#EF476F] mb-6 border-2 border-[#EF476F]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-sans mb-3 text-gray-900">Email Support</h2>
            <p className="text-gray-600 font-medium mb-8 flex-1">
              For general inquiries, account issues, or billing questions. We usually respond within 24 hours.
            </p>
            <a 
              href="mailto:supportchatmiai@gmail.com" 
              className="w-full bg-[#EF476F] text-white font-bold py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
            >
              Send an Email
            </a>
          </div>

          {/* Community Support Card */}
          <div className="bg-white border-4 border-black rounded-3xl p-8 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2"
              style={{ backgroundColor: 'rgba(88, 101, 242, 0.1)', color: '#5865F2', borderColor: '#5865F2' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-sans mb-3 text-gray-900">Discord Community</h2>
            <p className="text-gray-600 font-medium mb-8 flex-1">
              Join our active community on Discord to chat with the team, report bugs, and share your creations.
            </p>
            <a 
              href="https://discord.gg/UsdefHvkq4" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-white font-bold py-4 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#5865F2' }}
            >
              Join Discord Server
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
