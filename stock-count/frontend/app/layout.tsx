import type { Metadata } from "next";
import { Space_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const barlow = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "StockOps — Sistema de Contagem de Estoque",
  description: "Gerencie contagens de estoque com precisão e eficiência.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceMono.variable} ${barlow.variable}`}>
      <body className="bg-neutral-950 text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
