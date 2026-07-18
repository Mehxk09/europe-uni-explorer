import type { Metadata } from "next";
import Script from "next/script";
import { Figtree } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){}})()`;

export const metadata: Metadata = {
  title: "Europe University Explorer",
  description:
    "Browse European universities by country. Filter by tuition, living costs, and English programmes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans text-[16px] leading-relaxed antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
