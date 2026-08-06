import type { Metadata } from "next";
import { Fredoka, Caveat, Inter } from "next/font/google";
import "./globals.css";
import { AntiTheftWrapper } from "@/components/ui/AntiTheftWrapper";
import { FloatingElements } from "@/components/ui/FloatingElements";

const fredoka = Fredoka({
  variable: "--font-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Special Surprise For You! 🎁",
  description: "Create a beautiful, animated digital greeting card for someone special.",
  openGraph: {
    title: "A Special Surprise For You! 🎁",
    description: "Create a beautiful, animated digital greeting card for someone special.",
    url: "https://surprise-for-any-occasion-fzg1.vercel.app/",
    siteName: "Special Surprise",
    images: [
      {
        url: "https://surprise-for-any-occasion-fzg1.vercel.app/chatmi.jpg",
        width: 1200,
        height: 630,
        alt: "A beautifully wrapped gift box",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Special Surprise For You! 🎁",
    description: "Create a beautiful, animated digital greeting card for someone special.",
    images: ["https://surprise-for-any-occasion-fzg1.vercel.app/chatmi.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} ${caveat.variable} ${inter.variable} antialiased min-h-screen bg-bg-warm relative overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[-1] opacity-50 dot-pattern" />
        
        <AntiTheftWrapper>
          {/* Decorative Animated Floating Elements */}
          <FloatingElements />

          {children}
        </AntiTheftWrapper>
      </body>
    </html>
  );
}
