"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show back button on homepage
  if (pathname === "/") {
    return null
  }

  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`flex items-center space-x-1 space-x-reverse hover:bg-muted/50 ${className}`}
      aria-label="رجوع للصفحة السابقة"
    >
      {/* RTL-friendly arrow pointing right for Arabic */}
      <ChevronLeft className="h-4 w-4 rotate-180" />
      <span className="text-sm">رجوع</span>
    </Button>
  )
}
