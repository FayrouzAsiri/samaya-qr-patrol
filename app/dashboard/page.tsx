"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KPICard } from "@/components/ui/kpi-card"
import { StatusChip } from "@/components/ui/status-chip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { RefreshCw, Download, Filter, Calendar, MapPin, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Checkpoint {
  id: string
  name_ar: string
  name_en: string
  location: string
  school: string
  city: string
  token: string
  qr_url: string
  created_at: string
  updated_at: string
}

interface Scan {
  id: string
  checkpoint_id: string
  user_name: string
  status: string
  notes: string | null
  photo_url: string | null
  scanned_at: string
  checkpoints: Checkpoint
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({ from: "2024-01-01", to: "2024-01-10" })
  const [selectedCity, setSelectedCity] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [scans, setScans] = useState<Scan[]>([])
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [kpiData, setKpiData] = useState({
    readyPercentage: 0,
    schoolsCovered: 0,
    totalScans: 0,
    missedCheckpoints: 0,
    trend: { value: 0, isPositive: true },
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch scans with checkpoint data
      const scansResponse = await fetch("/api/scans")
      const scansData = await scansResponse.json()
      setScans(scansData)

      // Fetch checkpoints
      const checkpointsResponse = await fetch("/api/checkpoints")
      const checkpointsData = await checkpointsResponse.json()
      setCheckpoints(checkpointsData)

      // Calculate KPIs
      const readyScans = scansData.filter((scan: Scan) => scan.status === "جاهز").length
      const readyPercentage = scansData.length > 0 ? Math.round((readyScans / scansData.length) * 100) : 0
      const uniqueSchools = new Set(scansData.map((scan: Scan) => scan.checkpoints.school)).size
      const totalScans = scansData.length
      const missedCheckpoints = checkpointsData.length - new Set(scansData.map((scan: Scan) => scan.checkpoint_id)).size

      setKpiData({
        readyPercentage,
        schoolsCovered: uniqueSchools,
        totalScans,
        missedCheckpoints,
        trend: { value: 5.2, isPositive: true },
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => {
    fetchData()
  }

  const schoolReadiness = scans.reduce(
    (acc, scan) => {
      const school = scan.checkpoints.school
      if (!acc[school]) {
        acc[school] = { ready: 0, total: 0 }
      }
      acc[school].total++
      if (scan.status === "جاهز") {
        acc[school].ready++
      }
      return acc
    },
    {} as Record<string, { ready: number; total: number }>,
  )

  const schoolReadinessData = Object.entries(schoolReadiness).map(([school, data]) => ({
    school,
    ready: Math.round((data.ready / data.total) * 100),
  }))

  const userActivity = scans.reduce(
    (acc, scan) => {
      const user = scan.user_name
      acc[user] = (acc[user] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const userActivityData = Object.entries(userActivity)
    .map(([user, scans]) => ({ user, scans }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5)

  const scannedCheckpointIds = new Set(scans.map((scan) => scan.checkpoint_id))
  const missedCheckpointsData = checkpoints
    .filter((checkpoint) => !scannedCheckpointIds.has(checkpoint.id))
    .map((checkpoint) => ({
      school: checkpoint.school,
      checkpoint: checkpoint.name_ar,
      city: checkpoint.city,
      priority: "متوسط", // Default priority
      lastScan: "—",
    }))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالي":
        return "danger"
      case "متوسط":
        return "warning"
      case "منخفض":
        return "info"
      default:
        return "info"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/" className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-samaya-navy rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">س</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold samaya-navy">لوحة المؤشرات — Samaya QR Patrol</h1>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse flex-wrap gap-2">
              {/* Date Range Picker */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Label htmlFor="from-date" className="text-sm">
                  من:
                </Label>
                <Input
                  id="from-date"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-auto"
                />
                <Label htmlFor="to-date" className="text-sm">
                  إلى:
                </Label>
                <Input
                  id="to-date"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-auto"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex space-x-2 space-x-reverse">
                <Button variant="outline" size="sm">
                  اليوم
                </Button>
                <Button variant="outline" size="sm">
                  7 أيام
                </Button>
                <Button variant="outline" size="sm">
                  30 يوم
                </Button>
              </div>

              {/* City Filter */}
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="المدينة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المدن</SelectItem>
                  <SelectItem value="الرياض">الرياض</SelectItem>
                  <SelectItem value="جدة">جدة</SelectItem>
                  <SelectItem value="الدمام">الدمام</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button onClick={handleRefresh} disabled={isLoading} size="sm">
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? "animate-spin" : ""}`} />
                تحديث
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <KPICard
            title="الجاهزية الإجمالية"
            subtitle="Ready% (overall)"
            value={`${kpiData.readyPercentage}%`}
            trend={kpiData.trend}
            icon={<Shield className="h-4 w-4" />}
          />
          <KPICard
            title="المدارس المغطاة اليوم"
            subtitle="Schools covered today"
            value={kpiData.schoolsCovered}
            icon={<MapPin className="h-4 w-4" />}
          />
          <KPICard
            title="إجمالي المسوحات"
            subtitle="Total scans in range"
            value={kpiData.totalScans}
            icon={<Calendar className="h-4 w-4" />}
          />
          <KPICard
            title="النقاط المفقودة"
            subtitle="Missed checkpoints"
            value={kpiData.missedCheckpoints}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* School Readiness Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="samaya-navy">جاهزية المدارس</CardTitle>
                <p className="text-sm text-muted-foreground">School Readiness %</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={schoolReadinessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="school" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="ready" fill="#19344f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Activity Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="samaya-navy">النشاط حسب المنفّذ</CardTitle>
                <p className="text-sm text-muted-foreground">Activity Leaderboard</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="user" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="scans" fill="#f4c542" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Missed Checkpoints Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="samaya-navy">نقاط لم تُمسح</CardTitle>
              <p className="text-sm text-muted-foreground">Missed Checkpoints</p>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 ml-2" />
                فلترة
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المدرسة</TableHead>
                    <TableHead className="text-right">النقطة</TableHead>
                    <TableHead className="text-right">المدينة</TableHead>
                    <TableHead className="text-right">الأولوية</TableHead>
                    <TableHead className="text-right">آخر مسح</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missedCheckpointsData.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.school}</TableCell>
                      <TableCell>{item.checkpoint}</TableCell>
                      <TableCell>{item.city}</TableCell>
                      <TableCell>
                        <StatusChip variant={getPriorityColor(item.priority) as any}>{item.priority}</StatusChip>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.lastScan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 py-4 border-t text-center text-sm text-muted-foreground">
          آخر تحديث: {new Date().toLocaleTimeString("ar-SA")} — المصدر: Supabase
        </footer>
      </main>
    </div>
  )
}
