"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}
