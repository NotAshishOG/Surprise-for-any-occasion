"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen relative pt-12 px-6">
      <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 rounded-2xl relative z-10 mb-12">
        <Link href="/" className="inline-block mb-6 font-bold font-sans hover:-translate-x-1 hover:text-[#EF476F] transition-all absolute top-8 left-8">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-handwriting mb-8 mt-12 md:mt-0 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans text-gray-800 text-lg">
          {/* Left Column: Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b-4 border-black pb-2 inline-block">Send a Message</h2>
            
            {status === "success" ? (
              <div className="bg-[#06D6A0]/20 border-2 border-[#06D6A0] rounded-xl p-6 text-center mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-sm">Thank you for reaching out. We will get back to you soon.</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-bold underline hover:text-[#EF476F]">Send another message</button>
              </div>
            ) : (
              <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="font-bold text-sm">Name</label>
                  <input type="text" id="name" required value={formData.name} onChange={handleChange} placeholder="Your Name" className="border-2 border-black rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#FFD166]/50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-bold text-sm">Email</label>
                  <input type="email" id="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="border-2 border-black rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#FFD166]/50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="subject" className="font-bold text-sm">Subject</label>
                  <input type="text" id="subject" required value={formData.subject} onChange={handleChange} placeholder="How can we help you?" className="border-2 border-black rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#FFD166]/50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="message" className="font-bold text-sm">Message</label>
                  <textarea id="message" required value={formData.message} onChange={handleChange} rows={4} placeholder="Write your message here..." className="border-2 border-black rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#FFD166]/50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"></textarea>
                </div>
                
                {status === "error" && (
                  <div className="text-[#EF476F] font-bold text-sm">{errorMessage}</div>
                )}
                
                <button type="submit" disabled={status === "loading"} className="mt-2 bg-[#EF476F] text-white font-black text-lg py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Info */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <h2 className="text-2xl font-bold border-b-4 border-black pb-2 inline-block mb-4">Direct Contact</h2>
              <p className="mb-4 text-gray-600">
                Have a question, feedback, or need help with a card you created? We'd love to hear from you directly!
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 group">
                  <div className="bg-[#60A5FA] w-12 h-12 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Email us</p>
                    <a href="mailto:ashishmeena260309@gmail.com" className="font-bold hover:text-[#EF476F] transition-colors">ashishmeena260309@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="bg-[#FFD166] w-12 h-12 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Join Discord</p>
                    <a href="https://discord.gg/UsdefHvkq4" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#EF476F] transition-colors">Our Community Server</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
