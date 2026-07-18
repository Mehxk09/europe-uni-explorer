"use client";

import { AmbientBackground } from "@/components/motion/ambient-background";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AmbientBackground />
      {children}
      <SiteFooter />
    </ThemeProvider>
  );
}
