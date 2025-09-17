import type React from "react"
import type { Metadata } from "next"
import { Cairo, Readex_Pro } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
})

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-headings",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Samaya QR Patrol — سامايا",
  description: "نظام مراقبة المدارس والمرافق التعليمية",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} ${readexPro.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
