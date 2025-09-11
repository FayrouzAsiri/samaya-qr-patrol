"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  value: string
  size?: number
  className?: string
}

export function QRCodeGenerator({ value, size = 128, className }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return

    // Simple QR code placeholder - in real app, use a proper QR library like qrcode
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Draw simple pattern as placeholder
    ctx.fillStyle = "#000000"
    const moduleSize = size / 25

    // Draw corner squares
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
          ctx.fillRect((18 + i) * moduleSize, j * moduleSize, moduleSize, moduleSize)
          ctx.fillRect(i * moduleSize, (18 + j) * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Draw some data pattern
    for (let i = 8; i < 17; i++) {
      for (let j = 8; j < 17; j++) {
        if ((i + j) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [value, size])

  return (
    <canvas ref={canvasRef} width={size} height={size} className={className} style={{ imageRendering: "pixelated" }} />
  )
}
