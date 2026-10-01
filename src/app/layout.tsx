import type { Metadata, Viewport } from "next";
import { Inter, STIX_Two_Text } from "next/font/google";
import type { ReactNode } from "react";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const stix = STIX_Two_Text({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-stix", display: "swap" });

export const metadata: Metadata = {
  title: "Math Lab · SAT Math, one step at a time",
  description: "Decode SAT math traps, drill twin problems, and explore formulas with sliders.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${stix.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
