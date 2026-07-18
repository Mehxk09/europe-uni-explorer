"use client";

import { motion } from "framer-motion";

import { useTheme } from "@/components/theme-provider";

const orbs = [
  { pos: "left-[8%] top-[5%] h-[480px] w-[480px]", var: "--orb-1", duration: 24 },
  { pos: "right-[5%] top-[15%] h-[400px] w-[400px]", var: "--orb-2", duration: 20 },
  { pos: "bottom-[10%] left-[25%] h-[360px] w-[360px]", var: "--orb-3", duration: 28 },
  { pos: "bottom-[20%] right-[20%] h-[300px] w-[300px]", var: "--orb-4", duration: 22 },
];

export function AmbientBackground() {
  const { theme } = useTheme();

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-500"
      aria-hidden
      data-theme={theme}
    >
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(to bottom right, var(--bg-base), var(--bg-mid), var(--bg-end))`,
        }}
      />
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[100px] ${orb.pos}`}
          style={{ background: `var(${orb.var})` }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.92, 1],
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
