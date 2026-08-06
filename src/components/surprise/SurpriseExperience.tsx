"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Stage1Envelope } from "./Stage1Envelope";
import { Stage2Note } from "./Stage2Note";
import { Stage3Balloons } from "./Stage3Balloons";
import { Stage4Finale } from "./Stage4Finale";

import { CustomMusicPlayer } from "./CustomMusicPlayer";
import Link from "next/link";

interface Card {
  id: string;
  senderName?: string;
  recipientName: string;
  message: string;
  photo1Url?: string;
  photo2Url?: string;
  audioFileUrl?: string;
  audioLinkUrl?: string;
  signatureText?: string;
  extraPhotoUrls?: string[];
  balloonPhotoUrls?: string[];
  occasion: string;
  createdAt: string;
}

export function SurpriseExperience({ card }: { card: Card }) {
  const [stage, setStage] = useState(1);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const handleNext = (nextStage: number) => {
    if (nextStage === 2) {
      setMusicPlaying(true);
    }
    setStage(nextStage);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-8">
      <CustomMusicPlayer 
        audioFileUrl={card.audioFileUrl} 
        audioLinkUrl={card.audioLinkUrl} 
        playing={musicPlaying} 
      />
      
      {/* White Card Container */}
      <div className="relative w-full max-w-3xl min-h-[70vh] bg-white border-[6px] border-black rounded-[24px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-6 md:p-12 z-10">
        
        {/* Tape */}
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#FF9F1C] border-[3px] border-black rotate-[-2deg] z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)" }} 
        />
        
        {/* Sticker */}
        <div className="absolute -top-6 -right-6 w-20 h-20 md:w-24 md:h-24 bg-[#EF476F] border-[4px] border-black rounded-full flex flex-col items-center justify-center rotate-[15deg] z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <span className="text-white font-bold text-[10px] md:text-xs uppercase leading-tight text-center px-1">
             {card.occasion.split(" ").map((word, i) => (
               <span key={i} className="block">{word}</span>
             ))}
           </span>
        </div>

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20 hidden md:block">
          <Link href="/" className="px-4 py-2 bg-white border-2 border-black rounded-full text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            ← BACK TO FORM
          </Link>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {stage === 1 && <Stage1Envelope key="stage1" card={card} onNext={() => handleNext(2)} />}
            {stage === 2 && <Stage2Note key="stage2" card={card} onNext={() => handleNext(3)} />}
            
            {stage === 3 && (
              <Stage3Balloons key="stage3" card={card} onComplete={() => handleNext(4)} />
            )}
            
            {stage === 4 && (
              <Stage4Finale key="stage4" card={card} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
