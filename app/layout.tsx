import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NutriTrackProvider } from "@/hooks/useNutriTrack";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NutriTrack",
  description: "Track calories, water, and macros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NutriTrackProvider>
          {children}
        </NutriTrackProvider>
        {/* Toast Container */}
        <div id="toast-container" className="toast-container"></div>
      </body>
    </html>
  );
}
