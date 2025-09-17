import Image from "next/image"
import Link from "next/link"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
}

export function BrandLogo({ size = "md", href = "/", className = "" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  }

  const logoContent = (
    <div className={`flex items-center ${className}`}>
      <div className="flex-shrink-0">
        <Image
          src="/brand/samaya-logo.png"
          alt="Samaya"
          width={120}
          height={60}
          className={`${sizeClasses[size]} w-auto object-contain`}
          priority
        />
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
