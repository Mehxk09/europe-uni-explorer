"use client";

import { motion } from "framer-motion";

const dots = [
  { cx: 140, cy: 140, r: 4, color: "#22d3ee", delay: 0 },
  { cx: 95, cy: 95, r: 3, color: "#e879f9", delay: 0.5 },
  { cx: 185, cy: 110, r: 3.5, color: "#818cf8", delay: 1 },
  { cx: 170, cy: 175, r: 3, color: "#22d3ee", delay: 1.5 },
  { cx: 105, cy: 165, r: 2.5, color: "#f472b6", delay: 0.8 },
  { cx: 140, cy: 55, r: 2.5, color: "#67e8f9", delay: 1.2 },
];

export function HeroGlobe() {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[80px]" />
      <motion.svg
        viewBox="0 0 280 280"
        className="relative h-[320px] w-[320px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="140" cy="140" rx="120" ry="35" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="1" strokeDasharray="4 8" />
        <ellipse cx="140" cy="140" rx="120" ry="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <path
          d="M20 140c0-66 54-120 120-120s120 54 120 120"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </motion.svg>

      <svg viewBox="0 0 280 280" className="absolute inset-0 h-[320px] w-[320px]" aria-hidden>
        {dots.map((dot, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={dot.color}
              animate={{
                opacity: [0.4, 1, 0.4],
                r: [dot.r, dot.r + 2, dot.r],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: dot.delay,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r + 8}
              fill="none"
              stroke={dot.color}
              strokeWidth="1"
              opacity="0.3"
              animate={{ r: [dot.r + 4, dot.r + 16, dot.r + 4], opacity: [0.3, 0, 0.3] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: dot.delay,
              }}
            />
          </motion.g>
        ))}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "140px 140px" }}
        >
          <circle cx="140" cy="30" r="6" fill="#22d3ee" filter="url(#glow)" />
        </motion.g>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
