import { motion } from "framer-motion";
import { ConfettiEffect } from "../ui/ConfettiEffect";
import { useState } from "react";
import { audio } from "@/lib/audio";

interface Stage1Props {
  card: {
    occasion: string;
  };
  onNext: () => void;
}

export function Stage1Envelope({ card, onNext }: Stage1Props) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    audio.playTada();
    setOpened(true);
    setTimeout(onNext, 2000); // Wait for confetti and transition
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-4 text-center z-10 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      <ConfettiEffect trigger={opened} />
      
      <motion.h1
        className="text-3xl md:text-5xl font-bold mb-8 text-[#1A1A1A] tracking-tight bg-white px-6 py-2 rounded-xl"
        initial={{ y: -50, opacity: 0, rotate: 10 }}
        animate={{ y: 0, opacity: 1, rotate: -2 }}
        transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}
      >
        Happy {card.occasion}
      </motion.h1>

      <motion.button
        onClick={handleOpen}
        disabled={opened}
        className="group relative block"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`
          relative w-64 h-48 md:w-80 md:h-56 flex items-center justify-center transition-all duration-1000
          ${opened ? "rotate-12 scale-110 opacity-0" : "cursor-pointer"}
        `}>
          {/* Envelope Body */}
          <div className="absolute inset-0 bg-[#FFD166] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
          
          {/* Envelope Flap Lines (Simulated with borders) */}
          <div className="absolute top-0 left-0 w-full h-1/2 border-b-4 border-black origin-top transform scale-y-110 z-10 skew-y-[12deg] skew-x-[15deg] opacity-50" />
          <div className="absolute top-0 right-0 w-full h-1/2 border-b-4 border-black origin-top transform scale-y-110 z-10 skew-y-[-12deg] skew-x-[-15deg] opacity-50" />
          
          {/* Wax Seal */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#EF476F] rounded-full border-4 border-black flex items-center justify-center z-20 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-2xl text-white">❤️</span>
          </div>
          
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-handwriting text-xl text-gray-500">
            tap to open
          </span>
          <span className="absolute -bottom-16 left-1/2 -translate-x-1/2 font-sans text-[10px] tracking-widest text-gray-400 uppercase whitespace-nowrap">
            DESIGNS BY JOY
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}
