"use client";

import { motion } from "framer-motion";

const orbs = [
  { className: "orb-1 left-[5%] top-[10%] h-[420px] w-[420px] bg-cyan-500/30", duration: 22 },
  { className: "orb-2 right-[0%] top-[20%] h-[380px] w-[380px] bg-fuchsia-500/25", duration: 18 },
  { className: "orb-3 bottom-[10%] left-[30%] h-[320px] w-[320px] bg-violet-600/20", duration: 26 },
  { className: "orb-4 bottom-[20%] right-[15%] h-[260px] w-[260px] bg-blue-500/20", duration: 20 },
];

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#070714]" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-90" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[100px] ${orb.className}`}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 25, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
