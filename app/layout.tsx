"use client"; // ThemeProvider client-side'da çalışmalı

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  weight: ["200", "300", "500", "600", "700"],
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-dark-300  font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {isMounted ? children : null} {/* İlk render'da children boş bırakılıyor */}
        </ThemeProvider>
      </body>
    </html>
  );
} 
