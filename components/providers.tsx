"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
      <Toaster richColors position="top-right" />
      <Analytics />
    </ThemeProvider>
  )
}
