"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiEffect({ trigger = true }: { trigger?: boolean }) {
  useEffect(() => {
    if (trigger) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FF6B6B", "#C084FC", "#34D399"]
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FF6B6B", "#C084FC", "#34D399"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [trigger]);

  return null;
}
