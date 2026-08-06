"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const shapes = [
  // Circle
  { type: "circle", color: "#FFD166", w: "w-24", h: "h-24", rounded: "rounded-full" },
  // Pill
  { type: "pill", color: "#EF476F", w: "w-32", h: "h-16", rounded: "rounded-full" },
  // Square
  { type: "square", color: "#118AB2", w: "w-20", h: "h-20", rounded: "rounded-lg" },
  // Star (SVG)
  { type: "star", color: "#06D6A0", w: "w-24", h: "h-24", rounded: "rounded-none" },
];

export function FloatingElements() {
  const [elements, setElements] = useState<Array<{
    id: number;
    type: string;
    color: string;
    w: string;
    h: string;
    rounded: string;
    pos: { top?: string; bottom?: string; left?: string; right?: string };
    delay: number;
    duration: number;
    yOffset: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    // Generate random positions only on client to avoid hydration mismatches
    const generated = shapes.map((shape, i) => {
      // Four quadrants
      const quadrants = [
        { top: "10%", left: "10%" },
        { top: "70%", left: "15%" },
        { top: "15%", right: "10%" },
        { top: "75%", right: "15%" }
      ];
      
      const pos = quadrants[i % 4];
      
      return {
        ...shape,
        id: i,
        pos,
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 15,
        yOffset: 30 + Math.random() * 30,
        rotation: Math.random() * 360,
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setElements(generated);
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute ${el.w} ${el.h} ${el.rounded} border-4 border-black flex items-center justify-center opacity-80`}
          style={{
            ...el.pos,
            backgroundColor: el.type === "star" ? "transparent" : el.color,
            borderWidth: el.type === "star" ? 0 : 4,
          }}
          initial={{ y: 0, rotate: el.rotation }}
          animate={{
            y: [0, -el.yOffset, 0],
            rotate: [el.rotation, el.rotation + 45, el.rotation],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === "star" && (
            <svg viewBox="0 0 24 24" fill={el.color} stroke="black" strokeWidth="1.5" className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          )}
          {el.type !== "star" && (
            <div className="absolute inset-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" style={{ borderRadius: "inherit", zIndex: -1 }} />
          )}
        </motion.div>
      ))}
    </div>
  );
}
