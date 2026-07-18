"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label={
        mounted
          ? theme === "light"
            ? "Switch to dark mode"
            : "Switch to light mode"
          : "Toggle theme"
      }
    >
      {!mounted || theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
