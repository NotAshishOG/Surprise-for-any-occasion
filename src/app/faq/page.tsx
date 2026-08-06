import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function FAQ() {
  const faqs = [
    {
      question: "What is Chatmi AI?",
      answer: "Chatmi AI is India's leading AI Assistant, built for speed, creativity, and productivity. It helps you with a wide range of tasks from coding to content creation."
    },
    {
      question: "Is Chatmi AI free to use?",
      answer: "Yes, we offer a free tier with basic features. We also have premium plans for power users who need advanced capabilities and higher limits."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach out to us anytime at supportchatmiai@gmail.com or join our Discord server for real-time community support."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We take privacy seriously and do not use your personal conversations to train our models without your explicit consent. Your data is encrypted and stored securely."
    }
  ];

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
          <Link href="/contact" className="hover:text-[#EF476F] transition-colors">Contact</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Find answers to common questions about Chatmi AI. If you can't find what you're looking for, feel free to contact our support team.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <h3 className="text-xl font-bold font-sans mb-3 text-gray-900">{faq.question}</h3>
              <p className="text-gray-700 font-medium leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-[#FFE08A] border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold font-sans mb-4">Still have questions?</h2>
          <p className="text-gray-800 font-medium mb-6">Our support team is always ready to help you out.</p>
          <Link href="/support" className="inline-block bg-[#EF476F] text-white font-bold px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            Get Support
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
