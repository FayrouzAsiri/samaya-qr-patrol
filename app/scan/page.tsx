"use client"

import type React from "react"
import { BrandLogo } from "@/components/ui/brand-logo"
import { BackButton } from "@/components/ui/back-button"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, CheckCircle, AlertCircle, ArrowRight, Upload } from "lucide-react"
import Link from "next/link"

export default function ScanPage() {
  const [formData, setFormData] = useState({
    executorName: "",
    status: "",
    note: "",
    photo: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Mock checkpoint data - in real app this would come from URL params
  const checkpointData = {
    school: "مدرسة الأمل",
    checkpoint: "البوابة الرئيسية",
    token: "AML_GATE_001_2024",
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.executorName || !formData.status) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold samaya-navy mb-2">تم الحفظ بنجاح ✅</h2>
            <p className="text-muted-foreground mb-6">تم تسجيل المرور بنجاح في النظام</p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-samaya-navy hover:bg-samaya-navy/90">
                <Link href="/scan">مسح نقطة أخرى</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/dashboard">رجوع إلى اللوحة</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <div className="flex justify-start mb-2">
              <BackButton />
            </div>
            {/* BrandLogo component added to scan page header */}
            <div className="flex justify-center mb-3">
              <BrandLogo size="sm" className="px-6" />
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              سامايا <ArrowRight className="inline h-3 w-3 mx-1" /> {checkpointData.school}{" "}
              <ArrowRight className="inline h-3 w-3 mx-1" /> {checkpointData.checkpoint}
            </div>
            <h1 className="text-lg font-bold samaya-navy">{checkpointData.school}</h1>
            <h2 className="text-base font-semibold">{checkpointData.checkpoint}</h2>
            <p className="text-sm text-muted-foreground">تأكيد المرور اليومي</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="samaya-navy text-center">تسجيل المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Executor Name */}
              <div className="space-y-2">
                <Label htmlFor="executor-name" className="text-base font-medium">
                  اسم المنفّذ
                </Label>
                <Input
                  id="executor-name"
                  value={formData.executorName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, executorName: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                  className="text-base h-12"
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-3">
                <Label className="text-base font-medium">حالة النقطة</Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="flex-1 text-base cursor-pointer">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>سليم</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="bad" id="bad" />
                    <Label htmlFor="bad" className="flex-1 text-base cursor-pointer">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span>غير سليم</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-base font-medium">
                  ملاحظة
                </Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder={formData.status === "bad" ? "يرجى وصف المشكلة بالتفصيل..." : "ملاحظة مختصرة (اختياري)"}
                  className="text-base min-h-20"
                  rows={3}
                />
                {formData.status === "bad" && (
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>يرجى إضافة تفاصيل المشكلة</span>
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <Label className="text-base font-medium">صورة (اختياري)</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                          <span className="font-semibold">اضغط للتصوير</span>
                          <br />
                          أو اختر صورة من المعرض
                        </p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>

                  {photoPreview && (
                    <div className="relative">
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="معاينة الصورة"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 left-2"
                        onClick={() => {
                          setPhotoPreview(null)
                          setFormData((prev) => ({ ...prev, photo: null }))
                        }}
                      >
                        حذف
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Text */}
              <div className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg">
                سيتم حفظ التاريخ والوقت تلقائيًا
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4">
        <div className="container mx-auto max-w-md">
          <Button
            onClick={handleSubmit}
            disabled={!formData.executorName || !formData.status || isSubmitting}
            className="w-full h-12 text-base bg-samaya-navy hover:bg-samaya-navy/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري الحفظ...</span>
              </div>
            ) : (
              <>
                <Upload className="h-4 w-4 ml-2" />
                تأكيد وحفظ
              </>
            )}
          </Button>
          <div className="text-center mt-2">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              رجوع إلى اللوحة
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
