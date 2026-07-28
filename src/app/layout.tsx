import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Preloader } from "@/components/preloader";
import { GrainField } from "@/components/grain-field";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Inter is the body face Luma actually falls back to. Variable font — no
// weight array, same rule as the display face below (see CLAUDE.md).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Fraunces replaces Playfair Display: the closest free stand-in for New
// Spirit, the Adobe Fonts serif Luma uses and which we can't license here.
//
// `axes` is not optional decoration. Fraunces ships an optical-size axis, and
// Next subsets a variable font down to the wght axis unless the others are
// asked for by name — without `opsz` the glyphs stay at their small-text
// design (chunky, tight) at 7rem, which is exactly the size we use it at.
// SOFT rounds the terminals; that softness is most of what makes it read like
// New Spirit rather than like another Playfair.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divya Prakash — Frontend Engineer",
  description:
    "Portfolio of Divya Prakash, a frontend engineer working across code and design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plexMono.variable} ${inter.variable} ${fraunces.variable} font-sans antialiased bg-canvas text-ink`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll />
          <GrainField />
          <Preloader />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
