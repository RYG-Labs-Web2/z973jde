'use client';

import { Geist, Geist_Mono, UnifrakturCook, STIX_Two_Text, Creepster, Holtwood_One_SC } from "next/font/google";
import "./globals.css";
import { Header } from './Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unifrakturCook = UnifrakturCook({
  weight: "700", // UnifrakturCook only has one weight
  subsets: ["latin"],
  display: "swap",
});

const stixTwoText = STIX_Two_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const creepster = Creepster({
  weight: "400", // Creepster only has one weight
  subsets: ["latin"],
  display: "swap",
});

const holtwood = Holtwood_One_SC({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${stixTwoText.className} ${unifrakturCook.className} ${creepster.className} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
