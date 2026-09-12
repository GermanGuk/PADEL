import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CursorDot } from "@/components/ui/CursorDot";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { getSettings } from "@/lib/data/settings";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <LoadingScreen />
        {children}
        <CursorDot />
      </body>
    </html>
  );
}
