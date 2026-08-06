"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

// ─── COMPREHENSIVE KNOWLEDGE BASE ───────────────────────────────────────────

interface KnowledgeEntry {
  keywords: string[];
  response: string;
  priority: number;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ── GREETINGS ──
  {
    keywords: ["hello", "hi", "hey", "hola", "namaste", "sup", "yo", "good morning", "good evening", "good afternoon", "howdy"],
    response: "Hey there! 👋 Welcome to Chatmi AI's Surprise Card Creator! I can help you with creating cards, uploading photos, adding music, sharing your card, and much more. What would you like to know?",
    priority: 1,
  },

  // ── WHAT IS THIS SITE ──
  {
    keywords: ["what is this", "what does this", "what do you do", "what's this site", "what is this site", "what is this website", "purpose", "about this", "explain this"],
    response: "This is the Surprise Card Creator — a product built by ChatmiAI 🇮🇳! It lets you create beautiful, animated, interactive digital greeting cards for any occasion. Add your own photos, custom messages, music, and share them with a unique link. It's completely free! 🎉",
    priority: 10,
  },

  // ── WHO MADE THIS / CHATMI AI ──
  {
    keywords: ["who made", "who built", "who created", "developer", "chatmi ai", "chatmiai", "agency", "company", "creator", "notashishog", "ashish"],
    response: "This product was built by ChatmiAI — an Indian agency that builds AI chatbots, high-performance websites, mobile apps, and bold brand systems. Founded by NotAshishOG, ChatmiAI is trusted by 120+ founders and teams worldwide. Our motto: \"Websites that talk back — and convert.\" 🚀\n\n🌐 Visit us at chatmi.lovable.app",
    priority: 10,
  },

  // ── HOW TO CREATE A CARD ──
  {
    keywords: ["how to", "how do i", "how does", "steps", "guide", "tutorial", "create card", "make card", "get started", "start", "begin", "instructions"],
    response: "Here's how to create your surprise card in 4 easy steps:\n\nStep 1: Choose your occasion (Friendship Day, Birthday, Anniversary, Valentine's, or custom).\nStep 2: Enter your friend's name and your name.\nStep 3: Write a heartfelt message or use our AI Write feature to generate one with different vibes.\nStep 4: Optionally add photos, music, and a polaroid caption. Hit \"Preview the Surprise\" and share the link! 🎁\n\nIt takes about 2 minutes and is completely free!",
    priority: 9,
  },

  // ── OCCASIONS ──
  {
    keywords: ["occasion", "friendship day", "birthday", "anniversary", "valentine", "custom occasion", "what occasions", "which occasion", "event"],
    response: "We support multiple occasions! 🎊\n\n🤝 Friendship Day\n🎂 Birthday\n💍 Anniversary\n❤️ Valentine's Day\n✨ Custom — type in anything like Graduation, Promotion, Teacher's Day, Raksha Bandhan, etc.!\n\nJust pick one from the buttons or type your own.",
    priority: 8,
  },

  // ── PRICING / FREE ──
  {
    keywords: ["free", "cost", "pay", "price", "pricing", "charge", "money", "subscription", "premium", "plan"],
    response: "100% Free! 🎉 There are no hidden charges, no premium plans, and no subscriptions. You can create unlimited cards, add photos, music, and share them with anyone — all completely free. This is our gift to the world! 🌍",
    priority: 9,
  },

  // ── AI WRITE FEATURE ──
  {
    keywords: ["ai write", "ai message", "generate message", "write for me", "ai feature", "vibe", "vibes", "wholesome", "roast", "funny", "nostalgic", "hype", "auto write", "auto generate"],
    response: "Our AI Write feature is super cool! ✦\n\nPick a vibe and let AI craft the perfect message:\n🤍 Wholesome — heartfelt and warm\n😂 Roast-y & Funny — playful roasts for your bestie\n🙌 Ride-or-die Hype — bold, energetic, and empowering\n🌻 Nostalgic — sentimental trip down memory lane\n\nClick \"Write it for me\" and it generates a new message each time. You can keep clicking for different options!",
    priority: 9,
  },

  // ── PHOTOS / IMAGES / UPLOAD ──
  {
    keywords: ["photo", "picture", "image", "upload", "gif", "gallery", "memory", "memories", "polaroid"],
    response: "You can add multiple types of photos! 📸\n\n📷 Photo 1 — appears as a small polaroid at the end of the surprise\n🖼️ Photo 2 — shows up big at the center of the card\n📂 Extra Photos — up to 4 additional memory photos for a gallery\n🎈 Balloon Photos — up to 6 custom images or GIFs that appear as balloon pops!\n\nAll uploads support JPG, PNG, GIF, and WebP formats. Everything is optional!",
    priority: 9,
  },

  // ── MUSIC / AUDIO / SONG ──
  {
    keywords: ["music", "song", "audio", "youtube", "mp3", "soundtrack", "tune", "sound", "spotify"],
    response: "Add custom music that plays when your friend opens the card! 🎵\n\nTwo options:\n🔗 YouTube Link — paste any YouTube URL\n📁 Upload Audio — upload an MP3, WAV, or other audio file directly\n\nThe music starts playing automatically when the recipient opens their surprise card. It really sets the mood! 🎶",
    priority: 9,
  },

  // ── SHARING / SENDING ──
  {
    keywords: ["share", "send", "link", "whatsapp", "instagram", "how to send", "copy link", "unique link"],
    response: "Once you click \"Preview the Surprise\", you'll get a unique link! 🔗\n\nYou can:\n📋 Copy the link with one click\n📱 Share directly via WhatsApp, Instagram DM, Telegram, SMS, or any app using the native Share button\n\nThe link is permanent — your friend can open it anytime, on any device!",
    priority: 8,
  },

  // ── NAME OPTIONS ──
  {
    keywords: ["name", "what name", "bestie", "yaar", "dost", "bro", "sis", "nickname", "call them"],
    response: "You can pick a fun nickname or type a custom name! Quick picks include:\n\n💛 Bestie\n🤝 Yaar\n👋 Dost\n💪 Bro\n💕 Sis\n🌟 Best Friend\n✏️ Or type any name you want!\n\nThis name appears in the card's greeting message.",
    priority: 7,
  },

  // ── POLAROID / SIGNATURE / CAPTION ──
  {
    keywords: ["polaroid", "signature", "caption", "text on photo", "photo text"],
    response: "The Polaroid Caption is a small text that appears on the final photo display — like a handwritten note on a polaroid print! ✍️ You can customize it to say anything (up to 50 characters). You can change it to your name, an inside joke, or anything meaningful.",
    priority: 7,
  },

  // ── PREVIEW / DEMO ──
  {
    keywords: ["preview", "demo", "sample", "example", "see card", "test", "try"],
    response: "Want to see a demo? Click the \"Preview Demo\" button at the top of the page! 🎬 It shows you exactly what a finished surprise card looks like with all the animations, balloon pops, confetti, and music. You can also create your own card and preview it before sharing!",
    priority: 8,
  },

  // ── CONTACT / SUPPORT / HELP ──
  {
    keywords: ["contact", "support", "help", "email", "reach", "problem", "issue", "bug", "report"],
    response: "We're always here to help! 💬\n\n📧 Email: supportchatmiai@gmail.com\n💬 Discord: discord.gg/UsdefHvkq4\n📸 Instagram: @notashishog\n📺 YouTube: @NotAshishOG\n\nWe offer 24/7 support and typically respond within 24 hours. You can also visit our /contact or /support page!",
    priority: 8,
  },

  // ── PRIVACY / DATA ──
  {
    keywords: ["privacy", "data", "secure", "safe", "information", "personal", "collect"],
    response: "Your privacy is important to us! 🔒\n\n• We do not sell your personal data\n• Photos and messages are stored securely\n• We only collect what's necessary to generate your card\n• No tracking cookies for advertising\n\nRead our full privacy policy at /privacy.",
    priority: 7,
  },

  // ── TERMS ──
  {
    keywords: ["terms", "terms of service", "tos", "legal", "rules", "conditions"],
    response: "Our Terms of Service outline the rules for using our platform. Key points:\n\n• The service is free for personal, non-commercial use\n• Don't upload inappropriate or copyrighted content\n• We reserve the right to remove content that violates our guidelines\n\nRead the full terms at /terms.",
    priority: 6,
  },

  // ── FAQ ──
  {
    keywords: ["faq", "frequently asked", "questions", "common questions"],
    response: "Check out our FAQ page at /faq for answers to common questions! Topics include:\n\n• What is Chatmi AI?\n• Is it free to use?\n• How do I contact support?\n• Is my data secure?\n\nOr just ask me anything right here! I'm happy to help. 😊",
    priority: 7,
  },

  // ── ABOUT PAGE ──
  {
    keywords: ["about", "about us", "about page", "mission", "story", "who are you", "team"],
    response: "Our Mission: Make expressing emotions fun, easy, and unforgettable! 🌟\n\nThe Story: We started because digital greeting cards were boring. We wanted to create something that bundles memories, messages, and music into a delightful interactive experience.\n\nThe Team: A passionate crew of developers and designers, proudly building from India 🇮🇳, led by NotAshishOG.\n\nLearn more at /about!",
    priority: 7,
  },

  // ── SOCIAL MEDIA ──
  {
    keywords: ["social media", "social", "discord", "youtube", "instagram", "follow", "community", "channel"],
    response: "Join our community! 🌐\n\n💬 Discord: discord.gg/UsdefHvkq4 — chat with the team and community\n📺 YouTube: youtube.com/@NotAshishOG — tutorials, updates, and behind-the-scenes\n📸 Instagram: @notashishog — design inspiration and sneak peeks\n\nWe'd love to have you! Come hang out with us. 🤝",
    priority: 7,
  },

  // ── MOBILE / DEVICE ──
  {
    keywords: ["mobile", "phone", "tablet", "device", "responsive", "android", "iphone", "ipad", "screen"],
    response: "Yes! The site is fully responsive and works beautifully on every device! 📱💻\n\n• Mobile phones (Android & iPhone)\n• Tablets (iPad, etc.)\n• Desktop & Laptop\n\nThe cards your friends receive are also fully responsive — they'll look amazing on any screen size!",
    priority: 7,
  },

  // ── MADE IN INDIA ──
  {
    keywords: ["india", "indian", "made in india", "desi", "bharat"],
    response: "Yes! We are proudly Made in India 🇮🇳! ChatmiAI was founded and built entirely in India by NotAshishOG. We believe in showcasing Indian talent in the global tech scene. Our goal is to build world-class AI products that are accessible to everyone. Jai Hind! 🙌",
    priority: 7,
  },

  // ── CHATMI AI SERVICES ──
  {
    keywords: ["service", "chatbot", "website development", "brand", "hire", "build website", "build app", "agency service"],
    response: "ChatmiAI is a full-service digital agency! We offer:\n\n🤖 AI Chatbots — Custom-trained on your data, 24/7 text + voice, lead capture & CRM sync\n🌐 Web Development — Fast, accessible sites with 100/100 Lighthouse scores\n🎨 Brand Systems — Logo, design tokens, and component libraries\n\nTrusted by 120+ founders. Visit chatmi.lovable.app to learn more or get a quote!",
    priority: 8,
  },

  // ── ANIMATIONS ──
  {
    keywords: ["animation", "animated", "confetti", "balloon", "design", "beautiful"],
    response: "Our cards are packed with delightful animations! 🎨\n\n🎈 Balloon pops — with your custom photos or fun defaults\n🎊 Confetti explosions — when the card opens\n✨ Smooth transitions — everything feels premium and alive\n🎵 Background music — sets the perfect mood\n📷 Photo galleries — polaroid-style displays\n\nEvery card feels like a mini celebration! 🎉",
    priority: 6,
  },

  // ── LIMITS ──
  {
    keywords: ["limit", "how many", "maximum", "max", "characters", "size"],
    response: "Here are the limits for your card:\n\n• Name: up to 50 characters\n• Message: up to 600 characters\n• Extra Photos: up to 4\n• Balloon Photos: up to 6 (images or GIFs)\n• Polaroid Caption: up to 50 characters\n• Music: 1 YouTube link OR 1 audio file\n\nThere's no limit on how many cards you can create! 🎉",
    priority: 7,
  },

  // ── THANK YOU ──
  {
    keywords: ["thank", "thanks", "awesome", "great", "love it", "amazing", "wonderful", "cool", "nice"],
    response: "Aww, thank you so much! 🥰 That really means a lot to us! We built this with a lot of love and care. If you enjoy using it, consider joining our Discord community or following us on social media. And don't forget to share a card with your friends — spread the joy! 💛",
    priority: 5,
  },

  // ── GOODBYE ──
  {
    keywords: ["bye", "goodbye", "see you", "later", "cya", "exit", "close"],
    response: "Bye! 👋 Have an amazing day and don't forget to surprise someone special! If you ever need help, I'm always here. Happy card making! 🎉💛",
    priority: 5,
  },

  // ── WHO ARE YOU ──
  {
    keywords: ["who are you", "your name", "what are you", "are you ai", "are you a bot", "are you real", "chatbot"],
    response: "I'm Chatmi AI 🤖 — the smart assistant for this Surprise Card Creator! I'm here to help you navigate the site, answer your questions about creating cards, and guide you through every feature. I know everything about this platform, so don't hesitate to ask! Built with 💛 by ChatmiAI.",
    priority: 9,
  },

  // ── LANGUAGE ──
  {
    keywords: ["language", "hindi", "english", "spanish", "french", "translate"],
    response: "Currently, the site and I primarily communicate in English! 🌐 However, you can write your card messages in any language — Hindi, Spanish, French, or anything else. The card will display exactly what you type, so feel free to write in your preferred language! ❤️",
    priority: 6,
  },

  // ── BROWSER ──
  {
    keywords: ["browser", "chrome", "firefox", "safari", "edge", "opera"],
    response: "The site works on all modern browsers! ✅\n\n• Google Chrome (recommended)\n• Firefox\n• Safari\n• Microsoft Edge\n• Opera\n\nFor the best experience, we recommend using the latest version of your browser. The sharing feature works best on mobile browsers!",
    priority: 6,
  },

  // ── LOGIN ──
  {
    keywords: ["login", "sign up", "register", "account", "sign in", "log in"],
    response: "No login required! 🎉 You can create and share cards instantly without any account. Just fill in the form, preview your card, and share the link. It's that simple! No passwords, no sign-ups, no hassle.",
    priority: 8,
  },

  // ── DOWNLOAD / SAVE ──
  {
    keywords: ["download", "save", "export", "screenshot", "pdf"],
    response: "Currently, the best way to save your card is through the shareable link — it's permanent and can be opened anytime! 🔗 For a screenshot, you can use your device's built-in screenshot feature. We're working on adding a direct download/export option in future updates! Stay tuned. 🚀",
    priority: 7,
  },

  // ── FEEDBACK ──
  {
    keywords: ["feedback", "suggest", "suggestion", "idea", "feature request", "improve", "wish"],
    response: "We LOVE hearing from you! 💡\n\nShare your feedback or feature ideas:\n📧 Email: supportchatmiai@gmail.com\n💬 Discord: discord.gg/UsdefHvkq4\n\nEvery suggestion helps us make this platform better. We're continuously iterating and improving based on real user feedback! 🙌",
    priority: 7,
  },
];

// ─── SMART RESPONSE ENGINE ──────────────────────────────────────────────────

function getSmartResponse(userInput: string): string {
  const lower = userInput.toLowerCase().trim();

  if (lower.length <= 2) {
    return "Could you tell me a bit more? I'm here to help with anything about creating surprise cards, uploading photos, adding music, sharing, and more! 😊";
  }

  const scored = KNOWLEDGE_BASE.map((entry) => {
    let matchCount = 0;
    let exactMatch = false;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        matchCount++;
        if (lower === keyword || lower === keyword + "?") {
          exactMatch = true;
        }
      }
    }
    return {
      entry,
      score: matchCount > 0 ? matchCount * 10 + entry.priority + (exactMatch ? 50 : 0) : 0,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored[0].score > 0) {
    return scored[0].entry.response;
  }

  return "Hmm, I'm not sure about that one! 🤔 But I can help you with:\n\n🎴 Creating cards — step-by-step guide\n📸 Photos & GIFs — how to upload and where they appear\n🎵 Music — adding YouTube links or audio files\n🔗 Sharing — getting and sending the link\n✦ AI Write — auto-generating messages\n💬 Support — contact info and community\n\nTry asking about any of these!";
}

// ─── SUGGESTED QUESTIONS ────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "How do I create a card?",
  "Is it free?",
  "What photos can I add?",
  "How do I add music?",
  "Who made this?",
];

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export function SiteGuideChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hey! 👋 I'm Chatmi AI — your smart assistant for the Surprise Card Creator. Ask me anything about creating cards, adding photos, music, sharing, or our agency! What can I help you with?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowSuggestions(false);

    const delay = Math.min(300 + messageText.length * 15, 800);
    setTimeout(() => {
      const botReply: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: getSmartResponse(messageText),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, delay);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-black text-white p-3 sm:p-4 rounded-full shadow-[4px_4px_0px_0px_rgba(255,209,102,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,209,102,1)] transition-all flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
            style={{ height: "500px", maxHeight: "calc(100dvh - 32px)" }}
          >
            {/* Header */}
            <div className="bg-[#FFD166] border-b-[3px] border-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-transparent">
                  <img src="/chatmi.jpg" alt="Chatmi AI Logo" className="object-cover w-full h-full rounded-lg" />
                </div>
                <div>
                  <h3 className="font-bold font-sans leading-tight">Chatmi AI</h3>
                  <p className="text-xs font-medium text-black/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                    Online — Ask me anything!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#F5F5F5]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl border-2 border-black text-sm font-medium whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-[#34D399] rounded-br-sm"
                        : "bg-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl border-2 border-black bg-white rounded-bl-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              {showSuggestions && messages.length <= 1 && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Quick Questions</p>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="text-left text-sm font-medium bg-white px-3 py-2 rounded-xl border-2 border-black/10 hover:border-black hover:bg-[#FFD166]/20 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t-[3px] border-black flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:ring-0 text-sm font-medium"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-black text-white p-2 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            <a href="https://chatmi.lovable.app/" target="_blank" rel="noopener noreferrer" className="bg-[#F5F5F5] border-t-2 border-black/10 py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#5B21B6] transition-colors">
              Powered by
              <div className="w-4 h-4 rounded-sm overflow-hidden">
                <img src="/chatmi.jpg" alt="Chatmi AI Logo" className="object-cover w-full h-full" />
              </div>
              CHATMI AI
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
