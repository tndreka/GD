import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Graciano Dhima — From Pain To Performance | Online Fitness Coaching",
  description:
    "Online coaching, TRX, posture and strength programs by Graciano Dhima. Personalized coaching built on biomechanics — train anywhere, move pain-free, perform better.",
  openGraph: {
    title: "Graciano Dhima — From Pain To Performance",
    description: "Online fitness coaching, TRX & posture programs. Train with purpose, move with confidence.",
    url: "https://gracianodhima.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
