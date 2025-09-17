// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Noto_Sans_Arabic,Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const latin = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samaya QR Patrol — سمايا",
  description: "نظام مراقبة المدارس والمرافق التعليمية",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabic.className} ${latin.className} antialiased`} style={{ margin: 0 }}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
