import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { compliments } from "@/lib/compliments";
import { audio } from "@/lib/audio";
import confetti from "canvas-confetti";

interface Stage3Props {
  card?: { balloonPhotoUrls?: string[] };
  onComplete: () => void;
}

interface BalloonData {
  id: number;
  color: string;
  text: string;
  x: number;
  delay: number;
  durationY: number;
  durationX: number;
  animX: number;
  gifUrl: string;
  tilt: number;
}

const BALLOON_COLORS = ["#FF6B6B", "#C084FC", "#34D399", "#FBBF24", "#60A5FA", "#F472B6"];

export function Stage3Balloons({ card, onComplete }: Stage3Props) {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [poppedIds, setPoppedIds] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [travelDistance, setTravelDistance] = useState(900);
  const zIndexCounter = useRef(10);
  const [zMap, setZMap] = useState<Record<number, number>>({});
  const [allPopped, setAllPopped] = useState(false);

  // Safely measure travel distance after mount
  useEffect(() => {
    const update = () => setTravelDistance(window.innerHeight + 300);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const shuffled = [...compliments].sort(() => Math.random() - 0.5);
    const customPhotos = card?.balloonPhotoUrls || [];

    const newBalloons: BalloonData[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      text: shuffled[i % shuffled.length].text,
      x: 10 + (i * 14) + Math.random() * 8, // spread them evenly, slight randomness
      delay: i * 0.6 + Math.random() * 0.5,
      durationY: 12 + Math.random() * 6,
      durationX: 3 + Math.random() * 2,
      animX: Math.random() * 60 - 30,
      gifUrl: customPhotos.length > 0 ? customPhotos[i % customPhotos.length] : shuffled[i % shuffled.length].image,
      tilt: Math.random() > 0.5 ? (Math.random() * 12 + 5) : -(Math.random() * 12 + 5),
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBalloons(newBalloons);
  }, [card]);

  const handlePop = useCallback(
    (id: number, e: React.MouseEvent) => {
      if (poppedIds.has(id)) return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 25,
        spread: 70,
        origin: { x, y },
        colors: [balloons[id]?.color ?? "#FF6B6B"],
      });

      audio.playPop();

      const newPopped = new Set(poppedIds).add(id);
      setPoppedIds(newPopped);

      if (newPopped.size === balloons.length) {
        setTimeout(() => audio.playTada(), 500);
        setTimeout(() => setAllPopped(true), 800);
      }
    },
    [poppedIds, balloons]
  );

  const bringToFront = useCallback((id: number) => {
    zIndexCounter.current += 1;
    setZMap((prev) => ({ ...prev, [id]: zIndexCounter.current }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden py-4 md:py-8 flex flex-col items-center"
      style={{ minHeight: "60vh" }}
    >
      {/* Header */}
      <AnimatePresence>
        {poppedIds.size === 0 && (
          <motion.div
            className="relative z-30 text-center px-4 mb-4"
            exit={{ opacity: 0, height: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
              Pop every balloon 🎈
            </h2>
            <p className="text-gray-600">Each one holds something true.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Counter */}
      <div className="relative z-30 mt-2 mb-4">
        <div className="inline-block bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-1.5 rounded-full text-sm font-bold text-[#1A1A1A]">
          {poppedIds.size} / {balloons.length} popped
        </div>
      </div>

      {/* Balloon field */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {balloons.map((b) => (
          <AnimatePresence key={b.id}>
            {!poppedIds.has(b.id) && (
              <motion.div
                className="absolute bottom-[-160px] pointer-events-auto cursor-crosshair flex flex-col items-center"
                style={{ left: `${b.x}%`, translateX: "-50%" }}
                initial={{ y: 0 }}
                animate={{
                  y: -travelDistance,
                  x: [0, b.animX, 0],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  y: { duration: b.durationY, repeat: Infinity, ease: "linear", delay: b.delay },
                  x: { duration: b.durationX, repeat: Infinity, ease: "easeInOut" },
                }}
                onClick={(e) => handlePop(b.id, e)}
              >
                {/* Balloon Body */}
                <div
                  className="w-14 h-[4.5rem] md:w-[4.5rem] md:h-[5.5rem] relative shadow-inner border-2 border-black transition-transform hover:scale-110"
                  style={{
                    backgroundColor: b.color,
                    borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  }}
                >
                  {/* Shine highlight */}
                  <div className="absolute top-2 left-2 w-3.5 h-5 bg-white rounded-full opacity-50 rotate-[-45deg]" />
                </div>
                {/* Tie knot */}
                <div
                  className="w-0 h-0 mt-[-2px]"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: `8px solid ${b.color}`,
                  }}
                />
                {/* String */}
                <div className="w-[1.5px] h-14 bg-black/70" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Revealed compliment cards (draggable pile) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {balloons.map((b) =>
            poppedIds.has(b.id) ? (
              <motion.div
                key={`text-${b.id}`}
                className="absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                style={{ zIndex: zMap[b.id] ?? 10 }}
                initial={{ scale: 0, opacity: 0, y: 80, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotate: b.tilt }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", bounce: 0.45, duration: 0.6 }}
                drag
                dragConstraints={containerRef}
                dragElastic={0.15}
                whileDrag={{ scale: 1.08, rotate: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                whileHover={{ scale: 1.04 }}
                onDragStart={() => bringToFront(b.id)}
              >
                <div className="bg-white p-2 md:p-3 pb-12 md:pb-16 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-sm relative">
                  {/* Tape */}
                  <div
                    className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-12 h-5 bg-[#FFD166] border-2 border-black rotate-[-3deg] z-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)",
                    }}
                  />

                  {/* GIF */}
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 relative overflow-hidden rounded-sm border-2 border-black flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.gifUrl}
                      alt="reaction"
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>

                  {/* Compliment text */}
                  <div className="absolute bottom-2 left-0 w-full text-center px-2">
                    <span className="font-handwriting font-bold text-lg md:text-xl text-gray-900 break-words leading-tight select-none">
                      {b.text}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Next button after all popped */}
      <AnimatePresence>
        {allPopped && (
          <motion.div
            className="absolute bottom-6 md:bottom-10 z-50"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          >
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-[#FFD166] border-[3px] border-black rounded-full font-bold text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide"
            >
              NEXT →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
