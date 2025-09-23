import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "News Aggregator - Stay Updated with Latest News",
  description: "A modern news aggregator that brings you the latest news from around the world. Filter by categories, search for specific topics, and stay informed.",
  keywords: "news, aggregator, latest news, world news, technology, business, sports, health",
  authors: [{ name: "News Aggregator Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "News Aggregator - Stay Updated with Latest News",
    description: "A modern news aggregator that brings you the latest news from around the world.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "News Aggregator - Stay Updated with Latest News",
    description: "A modern news aggregator that brings you the latest news from around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
