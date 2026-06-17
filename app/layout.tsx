import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/Nav";

// Mirror the weights/styles the old project loaded from Google Fonts
// (Inter Tight 300–700, plus italic) so the type renders identically.
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Minimalist Calendar",
  description: "A minimalist day, week, and month planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} antialiased`}>
      <body className="min-h-screen w-full bg-[#FAFAFA] text-black p-6 md:p-12 selection:bg-black selection:text-white font-sans">
        <div className="max-w-8xl mx-auto flex flex-col min-h-[80vh]">
          <header className="mb-5 flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h1 className="text-1xl md:text-4xl font-bold leading-none mb-2 hover:opacity-60 transition-opacity duration-300">
                <Link href="/">Minimalist Calendar</Link>
              </h1>
            </div>
            <Nav />
          </header>
          {children}
          <div className="mt-12 md:mt-20 pt-8 border-t border-[#E5E5E5] text-center md:text-left">
            <p className="text-sm font-light text-[#737373] max-w-md">
              &quot;Simplicity is the ultimate sophistication.&quot;
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
