"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Search, Sparkles } from "lucide-react";

import { AnimatedCounter } from "@/components/motion/animated-counter";

interface HomeHeroProps {
  countryCount: number;
  universityCount: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ countryCount, universityCount }: HomeHeroProps) {
  return (
    <div className="panel-card panel-card-hero overflow-hidden">
      <div className="relative flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="badge-label">
            <Globe className="h-3.5 w-3.5" />
            Europe University Explorer
          </span>
          <h1 className="text-heading mt-6 text-[2.5rem] font-semibold leading-[1.08] tracking-tight lg:text-[3.75rem]">
            Find where to study in Europe
          </h1>
          <p className="text-muted mt-5 max-w-lg text-lg leading-relaxed">
            Compare tuition, living costs, and English programmes across {countryCount} countries
            and {universityCount.toLocaleString()} universities.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/wizard" className="btn btn-fill">
              <Sparkles className="h-4 w-4" />
              Help me choose
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/search" className="btn btn-ghost">
              <Search className="h-4 w-4" />
              Search universities
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="grid w-full shrink-0 grid-cols-2 gap-4 lg:w-[26rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <motion.div className="stat-tile" whileHover={{ scale: 1.02 }}>
            <p className="stat-number">
              <AnimatedCounter value={countryCount} />
            </p>
            <p className="stat-label">Countries</p>
          </motion.div>
          <motion.div className="stat-tile" whileHover={{ scale: 1.02 }}>
            <p className="stat-number">
              <AnimatedCounter value={universityCount} />
            </p>
            <p className="stat-label">Universities</p>
          </motion.div>
          <motion.div className="stat-tile col-span-2" whileHover={{ scale: 1.01 }}>
            <p className="text-heading text-[15px] font-medium">New here?</p>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              Browse countries below or use the guide to find options that fit your budget and goals.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
