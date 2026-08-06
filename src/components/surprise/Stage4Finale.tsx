import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiEffect } from "../ui/ConfettiEffect";
import Link from "next/link";
import Image from "next/image";

interface Stage4Props {
  card: {
    recipientName?: string;
    senderName?: string;
    photo1Url?: string;
    photo2Url?: string;
    extraPhotoUrls?: string[];
    signatureText?: string;
    occasion: string;
  };
}

const getOccasionQuotes = (occasion: string) => [
  `Celebrating this special ${occasion} 💛`,
  "Good times + great company = Best memories 🤪",
  "Side by side or miles apart, always close to the heart 💕",
  "Life was meant for good times and great adventures 🌟",
  "You're stuck with me forever, no refunds 😂",
  "Together making memories since day one 🤝",
];

const FLOATING_EMOJIS = ["🎉", "💖", "✨", "🌟", "💛", "🎈", "🤝", "🎊", "⭐", "💜", "🦋", "🌈"];

// Sparkle component for the photo
function Sparkle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  const [repeatDelay, setRepeatDelay] = useState(2);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRepeatDelay(2 + Math.random() * 3);
  }, []);

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
          fill="#FFD166"
          stroke="#1A1A1A"
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  );
}

// Floating emoji particle
function FloatingEmoji({ emoji, delay, startX }: { emoji: string; delay: number; startX: number }) {
  const [randomVals, setRandomVals] = useState<{x: number, rotate: number, duration: number, repeatDelay: number} | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomVals({
      x: Math.random() * 80 - 40,
      rotate: Math.random() * 360 - 180,
      duration: 5 + Math.random() * 3,
      repeatDelay: Math.random() * 4,
    });
  }, []);

  if (!randomVals) return null;

  return (
    <motion.div
      className="absolute text-2xl md:text-3xl pointer-events-none select-none"
      style={{ left: `${startX}%`, bottom: "-40px" }}
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{
        y: [0, -600],
        opacity: [0, 1, 1, 0],
        scale: [0.3, 1, 1, 0.5],
        x: [0, randomVals.x],
        rotate: [0, randomVals.rotate],
      }}
      transition={{
        duration: randomVals.duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: randomVals.repeatDelay,
        ease: "easeOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Animated doodle heart
function DoodleHeart({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", bounce: 0.6 }}
    >
      <motion.svg
        width="36" height="36" viewBox="0 0 24 24"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#EF476F"
          stroke="#1A1A1A"
          strokeWidth="1.5"
        />
      </motion.svg>
    </motion.div>
  );
}

// Animated star doodle
function DoodleStar({ className, delay, color }: { className: string; delay: number; color: string }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ scale: 0, opacity: 0, rotate: -45 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ delay, type: "spring", bounce: 0.7 }}
    >
      <motion.svg
        width="28" height="28" viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z"
          fill={color}
          stroke="#1A1A1A"
          strokeWidth="1"
        />
      </motion.svg>
    </motion.div>
  );
}

export function Stage4Finale({ card }: Stage4Props) {
  const [rotate, setRotate] = useState(-4);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = useMemo(() => getOccasionQuotes(card.occasion), [card.occasion]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotate(Math.random() > 0.5 ? 4 : -4);
  }, []);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const caption = card.signatureText || "designs by joy";

  // Set floating emojis in an effect to avoid hydration mismatch and purity errors
  const [floatingEmojis, setFloatingEmojis] = useState<{emoji: string, delay: number, startX: number}[]>([]);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFloatingEmojis(
      FLOATING_EMOJIS.map((emoji, i) => ({
        emoji,
        delay: i * 0.8 + Math.random() * 2,
        startX: Math.random() * 90 + 5,
      }))
    );
  }, []);

  // Sparkle positions around the polaroid
  const sparkles = useMemo(() => [
    { delay: 0.8, x: "-12px", y: "-12px", size: 20 },
    { delay: 1.5, x: "calc(100% + 4px)", y: "20%", size: 16 },
    { delay: 2.2, x: "15%", y: "calc(100% + 6px)", size: 18 },
    { delay: 1.0, x: "calc(100% - 10px)", y: "-14px", size: 22 },
    { delay: 2.8, x: "-16px", y: "70%", size: 14 },
    { delay: 3.5, x: "50%", y: "-18px", size: 16 },
  ], []);

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center px-4 py-4 md:py-8 gap-6 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ConfettiEffect trigger={true} />

      {/* Floating emoji particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {floatingEmojis.map((e, i) => (
          <FloatingEmoji key={i} emoji={e.emoji} delay={e.delay} startX={e.startX} />
        ))}
      </div>

      {/* Doodle decorations around the card */}
      <DoodleHeart className="-top-2 -left-2 md:top-2 md:left-4" delay={1.0} />
      <DoodleHeart className="top-4 right-2 md:top-6 md:right-6" delay={1.4} />
      <DoodleStar className="bottom-16 -left-1 md:bottom-20 md:left-2" delay={1.6} color="#FFD166" />
      <DoodleStar className="bottom-28 right-0 md:bottom-32 md:right-4" delay={2.0} color="#60A5FA" />
      <DoodleStar className="top-12 left-1/4" delay={2.5} color="#C084FC" />

      {/* Main heading with staggered word animation */}
      <motion.h2
        className="text-3xl md:text-5xl font-bold text-center text-[#1A1A1A] font-handwriting relative z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2, duration: 0.8 }}
      >
        <motion.span
          className="inline-block"
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          here&apos;s to more of us.
        </motion.span>
      </motion.h2>

      {/* Rotating friendship quote */}
      <div className="h-8 relative z-10 overflow-hidden flex items-center justify-center w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            className="text-sm md:text-base text-gray-500 font-medium text-center italic absolute"
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.5 }}
          >
            {quotes[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Interactive Polaroid photo */}
      <motion.div
        className="relative z-10 cursor-pointer mt-12 md:mt-16"
        initial={{ scale: 0.5, opacity: 0, rotate: -15, y: 100 }}
        animate={{ scale: 1, opacity: 1, rotate, y: 0 }}
        transition={{ type: "spring", bounce: 0.6, delay: 0.6, duration: 0.8 }}
        whileHover={{
          scale: 1.05,
          rotate: 0,
          transition: { type: "spring", bounce: 0.4 },
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Sparkles around the photo */}
        {sparkles.map((s, i) => (
          <Sparkle key={i} delay={s.delay} x={s.x} y={s.y} size={s.size} />
        ))}

        <div className="bg-white p-3 md:p-5 pb-16 md:pb-24 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm max-w-xs relative overflow-visible mb-8 md:mb-12">
          {/* Tape */}
          <div
            className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-24 h-6 bg-[#FFD166] border-2 border-black rotate-[-3deg] z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
            }}
          />

          {/* Small corner sticker */}
          <motion.div
            className="absolute -top-3 -right-3 w-10 h-10 bg-[#34D399] border-2 border-black rounded-full flex items-center justify-center z-20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 15 }}
            transition={{ delay: 1.2, type: "spring", bounce: 0.7 }}
          >
            <span className="text-lg">✨</span>
          </motion.div>

          {/* Photo */}
          <div className="w-56 h-56 md:w-72 md:h-72 bg-gray-100 relative overflow-hidden rounded-sm border-2 border-black">
            {card.photo2Url ? (
              <>
                <Image 
                  src={card.photo2Url} 
                  alt="Us" 
                  fill
                  unoptimized={true}
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
                {/* Subtle shimmer overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, delay: 2, repeat: Infinity, repeatDelay: 5 }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#EF476F]/20 relative">
                <motion.span
                  className="text-6xl"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  💖
                </motion.span>
              </div>
            )}
          </div>

          {/* Caption / signature */}
          <div className="absolute bottom-4 md:bottom-8 left-0 w-full text-center px-2">
            <motion.span
              className="font-handwriting font-bold text-xl md:text-2xl text-gray-900 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {caption}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Second photo (if photo1 exists, show it as a smaller tilted companion) */}
      {card.photo1Url && (
        <motion.div
          className="absolute z-0"
          style={{ bottom: "10%", right: "2%" }}
          initial={{ scale: 0, opacity: 0, rotate: 20 }}
          animate={{ scale: 0.6, opacity: 0.7, rotate: 12 }}
          transition={{ delay: 2, type: "spring", bounce: 0.5 }}
          whileHover={{ scale: 0.8, opacity: 1, zIndex: 30 }}
        >
          <div className="bg-white p-2 pb-6 md:pb-8 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-gray-100 overflow-hidden rounded-sm border border-black relative">
              <Image 
                src={card.photo1Url} 
                alt="Memory" 
                fill
                unoptimized={true}
                className="object-cover pointer-events-none" 
                draggable={false}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Extra gallery photos scattered around */}
      {card.extraPhotoUrls && card.extraPhotoUrls.map((url, i) => {
        // Pre-defined scatter positions for up to 4 extra photos inside the container bounds
        const positions = [
          { top: "5%", left: "5%", rotate: -15, hoverRotate: -5 },
          { top: "15%", right: "5%", rotate: 25, hoverRotate: 10 },
          { bottom: "25%", left: "5%", rotate: -20, hoverRotate: -10 },
          { bottom: "10%", right: "8%", rotate: 15, hoverRotate: 5 },
        ];
        const pos = positions[i % positions.length];
        
        return (
          <motion.div
            key={url}
            className="absolute z-0"
            style={pos}
            initial={{ scale: 0, opacity: 0, rotate: pos.rotate }}
            animate={{ scale: 0.5, opacity: 0.6, rotate: pos.rotate }}
            transition={{ delay: 2.2 + (i * 0.2), type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 0.75, opacity: 1, rotate: pos.hoverRotate, zIndex: 30 }}
          >
            <div className="bg-white p-1.5 md:p-2 pb-5 md:pb-8 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 overflow-hidden rounded-sm border border-black relative">
                <Image 
                  src={url} 
                  alt={`Gallery ${i+1}`} 
                  fill
                  unoptimized={true}
                  className="object-cover pointer-events-none" 
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Friendship band / bracelet divider */}
      <motion.div
        className="flex items-center gap-2 relative z-10"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <div className="h-1 w-8 bg-[#EF476F] rounded-full border border-black" />
        <div className="h-1 w-8 bg-[#FFD166] rounded-full border border-black" />
        <div className="h-1 w-8 bg-[#34D399] rounded-full border border-black" />
        <div className="h-1 w-8 bg-[#60A5FA] rounded-full border border-black" />
        <div className="h-1 w-8 bg-[#C084FC] rounded-full border border-black" />
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/"
            className="brutalist-button px-8 py-3.5 bg-[#FFD166] text-black border-[3px] border-black font-bold font-sans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl inline-flex items-center gap-2 text-base"
          >
            <span>🎁</span>
            Create your own surprise
            <span>→</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
