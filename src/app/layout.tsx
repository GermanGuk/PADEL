import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CursorDot } from "@/components/ui/CursorDot";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Top Padel Alicante",
  description: "Падел-клуб в Аликанте: тренировки, турниры, сообщество игроков.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        {children}
        <CursorDot />
      </body>
    </html>
  );
}
