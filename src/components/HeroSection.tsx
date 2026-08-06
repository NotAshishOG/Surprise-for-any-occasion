"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative pt-20 pb-12 text-center overflow-hidden z-10 px-4">
      <motion.div 
        className="text-sm font-bold bg-[#FFD166] text-[#1A1A1A] inline-block px-4 py-1.5 rounded-full border-[3px] border-black mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] tracking-wide uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        🎉 Make their day special
      </motion.div>

      <motion.h1 
        className="text-4xl sm:text-5xl md:text-7xl font-bold mb-16 md:mb-20 tracking-tight leading-[1.2] max-w-4xl font-sans text-[#1A1A1A] mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        Create a magical surprise for <br className="hidden md:block"/>
        <span className="text-[#FFD166] inline-block -rotate-3 bg-[#1A1A1A] px-4 sm:px-6 py-2 mt-4 sm:mt-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,209,102,1)] sm:shadow-[6px_6px_0px_0px_rgba(255,209,102,1)] rounded-2xl relative z-20">any occasion</span>
      </motion.h1>
      
      <motion.p 
        className="text-base sm:text-lg md:text-2xl mb-12 text-[#1A1A1A] max-w-2xl mx-auto font-medium bg-white px-4 sm:px-6 py-4 sm:py-5 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Birthdays, anniversaries, or just because. Build a custom interactive digital card with your photos and memories in seconds.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Link 
          href="/surprise/preview" 
          className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1A1A1A] border-4 border-black rounded-2xl font-bold hover:bg-[#F5F5F5] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 text-xl"
        >
          <PlayCircle className="w-6 h-6 text-[#1A1A1A]" />
          Preview Demo
        </Link>
      </motion.div>
    </div>
  );
}
