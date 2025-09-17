"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusChip } from "@/components/ui/status-chip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, Copy, Eye, EyeOff, QrCode, Printer, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { QRCodeGenerator } from "@/components/ui/qr-code-generator"
import { BrandLogo } from "@/components/ui/brand-logo"
import { BackButton } from "@/components/ui/back-button"

// Interfaces for type safety
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

export default function AdminPage() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [selectedCheckpoints, setSelectedCheckpoints] = useState<string[]>([])
  const [filters, setFilters] = useState({
    city: "all",
    school: "all",
    type: "all",
    hasToken: "all",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [revealedTokens, setRevealedTokens] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  // New checkpoint form state
  const [newCheckpoint, setNewCheckpoint] = useState({
    school: "",
    name_ar: "",
    name_en: "",
    location: "",
    city: "الرياض",
    autoGenerateToken: true,
  })

  const fetchCheckpoints = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/checkpoints")
      const data = await response.json()
      setCheckpoints(data)
    } catch (error) {
      console.error("Error fetching checkpoints:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCheckpoints()
  }, [])

  const handleRevealToken = (id: string) => {
    setRevealedTokens((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In real app, show toast notification
  }

  const handleAddCheckpoint = async () => {
    if (!newCheckpoint.school || !newCheckpoint.name_ar || !newCheckpoint.location) return

    try {
      const response = await fetch("/api/checkpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_ar: newCheckpoint.name_ar,
          name_en: newCheckpoint.name_en || newCheckpoint.name_ar,
          location: newCheckpoint.location,
          school: newCheckpoint.school,
          city: newCheckpoint.city,
        }),
      })

      if (response.ok) {
        const newCheckpointData = await response.json()
        setCheckpoints((prev) => [...prev, newCheckpointData])
        setNewCheckpoint({
          school: "",
          name_ar: "",
          name_en: "",
          location: "",
          city: "الرياض",
          autoGenerateToken: true,
        })
        setShowAddDialog(false)
      }
    } catch (error) {
      console.error("Error adding checkpoint:", error)
    }
  }

  const filteredCheckpoints = checkpoints.filter((cp) => {
    if (filters.city !== "all" && cp.city !== filters.city) return false
    if (filters.school !== "all" && cp.school !== filters.school) return false
    if (filters.hasToken !== "all") {
      const hasToken = filters.hasToken === "yes"
      if (!!cp.token !== hasToken) return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredCheckpoints.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCheckpoints = filteredCheckpoints.slice(startIndex, startIndex + itemsPerPage)

  const schools = Array.from(new Set(checkpoints.map((cp) => cp.school)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* BrandLogo Component */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <BackButton />
              <BrandLogo className="px-6" />
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-samaya-navy hover:bg-samaya-navy/90">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة نقطة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="samaya-navy">إضافة نقطة جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="school">المدرسة</Label>
                      <Input
                        id="school"
                        value={newCheckpoint.school}
                        onChange={(e) => setNewCheckpoint((prev) => ({ ...prev, school: e.target.value }))}
                        placeholder="اسم المدرسة"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name_ar">اسم النقطة (عربي)</Label>
                      <Input
                        id="name_ar"
                        value={newCheckpoint.name_ar}
                        onChange={(e) => setNewCheckpoint((prev) => ({ ...prev, name_ar: e.target.value }))}
                        placeholder="مثال: البوابة الرئيسية"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name_en">اسم النقطة (إنجليزي)</Label>
                      <Input
                        id="name_en"
                        value={newCheckpoint.name_en}
                        onChange={(e) => setNewCheckpoint((prev) => ({ ...prev, name_en: e.target.value }))}
                        placeholder="Main Gate"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">الموقع</Label>
                      <Input
                        id="location"
                        value={newCheckpoint.location}
                        onChange={(e) => setNewCheckpoint((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="وصف الموقع"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">المدينة</Label>
                      <Select
                        value={newCheckpoint.city}
                        onValueChange={(value) => setNewCheckpoint((prev) => ({ ...prev, city: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="الرياض">الرياض</SelectItem>
                          <SelectItem value="جدة">جدة</SelectItem>
                          <SelectItem value="الدمام">الدمام</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button onClick={handleAddCheckpoint} className="flex-1 bg-samaya-navy hover:bg-samaya-navy/90">
                        إضافة
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={fetchCheckpoints} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? "animate-spin" : ""}`} />
                تحديث
              </Button>

              <Button variant="outline" onClick={() => setShowPrintPreview(true)}>
                <Printer className="h-4 w-4 ml-2" />
                طباعة
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="samaya-navy flex items-center">
                  <Filter className="h-4 w-4 ml-2" />
                  الفلاتر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <Label>المدينة</Label>
                    <Select
                      value={filters.city}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, city: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المدن</SelectItem>
                        <SelectItem value="الرياض">الرياض</SelectItem>
                        <SelectItem value="جدة">جدة</SelectItem>
                        <SelectItem value="الدمام">الدمام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المدرسة</Label>
                    <Select
                      value={filters.school}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, school: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المدارس</SelectItem>
                        {schools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>نوع النقطة</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأنواع</SelectItem>
                        {/* <SelectItem value="gate">البوابة</SelectItem>
                        <SelectItem value="pump">غرفة المضخات</SelectItem>
                        <SelectItem value="ac">غرفة التكييف</SelectItem>
                        <SelectItem value="fire">نظام الإطفاء</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>حالة الرمز</Label>
                    <Select
                      value={filters.hasToken}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, hasToken: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="yes">يوجد رمز</SelectItem>
                        <SelectItem value="no">لا يوجد رمز</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checkpoints Table */}
            <Card>
              <CardHeader>
                <CardTitle className="samaya-navy">نقاط التفتيش</CardTitle>
                <p className="text-sm text-muted-foreground">إجمالي {filteredCheckpoints.length} نقطة</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المدرسة</TableHead>
                        <TableHead className="text-right">النقطة</TableHead>
                        <TableHead className="text-right">الموقع</TableHead>
                        <TableHead className="text-right">الرمز</TableHead>
                        <TableHead className="text-right">رابط المسح</TableHead>
                        <TableHead className="text-right">QR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCheckpoints.map((checkpoint) => (
                        <TableRow key={checkpoint.id}>
                          <TableCell className="font-medium">{checkpoint.school}</TableCell>
                          <TableCell>{checkpoint.name_ar}</TableCell>
                          <TableCell>{checkpoint.location}</TableCell>
                          <TableCell>
                            {checkpoint.token ? (
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {revealedTokens.has(checkpoint.id) ? checkpoint.token : "••••••••••••"}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevealToken(checkpoint.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {revealedTokens.has(checkpoint.id) ? (
                                    <EyeOff className="h-3 w-3" />
                                  ) : (
                                    <Eye className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyToClipboard(checkpoint.token)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <StatusChip variant="warning">لا يوجد رمز</StatusChip>
                            )}
                          </TableCell>
                          <TableCell>
                            {checkpoint.qr_url ? (
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <code className="text-xs bg-muted px-2 py-1 rounded max-w-32 truncate">
                                  {checkpoint.qr_url}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyToClipboard(checkpoint.qr_url)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {checkpoint.token ? (
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                <QrCode className="h-4 w-4" />
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      عرض {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCheckpoints.length)} من{" "}
                      {filteredCheckpoints.length}
                    </p>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="samaya-navy text-sm">نصائح للتركيب</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-start space-x-2 space-x-reverse">
                  <Badge variant="outline" className="text-xs">
                    البوابة
                  </Badge>
                  <p className="text-muted-foreground">ضع الملصق على ارتفاع مناسب بجانب البوابة</p>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <Badge variant="outline" className="text-xs">
                    المضخات
                  </Badge>
                  <p className="text-muted-foreground">داخل غرفة المضخات على الجدار المواجه</p>
                </div>
                <div className="flex items-start space-x-2 space-x-reverse">
                  <Badge variant="outline" className="text-xs">
                    التكييف
                  </Badge>
                  <p className="text-muted-foreground">بجانب وحدة التحكم الرئيسية</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Print Preview Dialog */}
        <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="samaya-navy">معاينة الطباعة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {checkpoints
                .filter((cp) => cp.token)
                .map((checkpoint) => (
                  <div key={checkpoint.id} className="border rounded-lg p-4 text-center space-y-2">
                    <h3 className="font-semibold text-sm samaya-navy">{checkpoint.school}</h3>
                    <p className="text-xs text-muted-foreground">{checkpoint.name_ar}</p>
                    <QRCodeGenerator value={checkpoint.qr_url} size={80} />
                    <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{checkpoint.qr_url}</p>
                  </div>
                ))}
            </div>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button onClick={() => window.print()} className="bg-samaya-navy hover:bg-samaya-navy/90">
                <Printer className="h-4 w-4 ml-2" />
                طباعة
              </Button>
              <Button variant="outline" onClick={() => setShowPrintPreview(false)}>
                إغلاق
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
