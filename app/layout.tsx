import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "BuildProof — Construction progress you can verify",
  description:
    "Structured evidence, milestone tracking, and monthly reports for off-plan real estate. Built for developers, buyers, and investors who need proof, not promises.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${grotesk.variable} ${plexMono.variable} font-sans bg-paper text-ink`}>
        {children}
      </body>
    </html>
  );
}
