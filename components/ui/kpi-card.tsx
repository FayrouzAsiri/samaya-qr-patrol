import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  subtitle?: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}

export function KPICard({ title, subtitle, value, trend, icon, className }: KPICardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold samaya-navy">{value}</div>
          {trend && (
            <div className={cn("flex items-center text-xs", trend.isPositive ? "text-green-600" : "text-red-600")}>
              <span className="mr-1">{trend.isPositive ? "↗" : "↘"}</span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
