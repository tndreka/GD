import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Analytics from "@/components/Analytics";
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
  metadataBase: new URL("https://gracianodhima.com"),
  title: "Graciano Dhima — From Pain To Performance | Online Fitness Coaching",
  description:
    "Online coaching, TRX, posture and strength programs by Graciano Dhima. Personalized coaching built on biomechanics — train anywhere, move pain-free, perform better.",
  openGraph: {
    title: "Graciano Dhima — From Pain To Performance",
    description: "Online fitness coaching, TRX & posture programs. Train with purpose, move with confidence.",
    url: "https://gracianodhima.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graciano Dhima — From Pain To Performance",
    description: "Online fitness coaching, TRX & posture programs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
