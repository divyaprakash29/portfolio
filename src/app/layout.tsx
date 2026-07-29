import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Preloader } from "@/components/preloader";
import { GrainField } from "@/components/grain-field";

// Two families, down from three (Fraunces + Inter + IBM Plex Mono).
//
// Instrument Serif is NOT a variable font — Google ships it at a single 400
// weight. That's the opposite of the rule the rest of this file follows, so it
// takes an explicit `weight` and there is no heavier cut to reach for: every
// `font-medium`/`font-semibold` on display type had to come off, or the browser
// synthesises a faux-bold, which on a serif this high-contrast smears the
// hairlines. See CLAUDE.md.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

// Geist is not in next/font/google at all on Next 14 — it only exists as
// Vercel's own package, which self-hosts the files (no Google request, same as
// next/font would give us). It exposes a ready-made instance rather than a
// constructor, so there's nothing to configure here.

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
        className={`${GeistSans.variable} ${instrumentSerif.variable} font-sans antialiased bg-canvas text-ink`}
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
