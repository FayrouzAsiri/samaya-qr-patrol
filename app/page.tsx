import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-8 h-8 bg-samaya-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">س</span>
              </div>
              <div>
                <h1 className="text-xl font-bold samaya-navy">Samaya QR Patrol</h1>
                <p className="text-sm text-muted-foreground">نظام مراقبة المدارس والمرافق</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="samaya-navy">لوحة المؤشرات</CardTitle>
              <p className="text-sm text-muted-foreground">Dashboard Overview</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">عرض شامل للجاهزية والنشاط اليومي عبر المدارس</p>
              <Link href="/dashboard">
                <Button className="w-full bg-samaya-navy hover:bg-samaya-navy/90">فتح اللوحة</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="samaya-navy">إدارة النقاط</CardTitle>
              <p className="text-sm text-muted-foreground">Checkpoints Management</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">إدارة نقاط التفتيش وإنشاء رموز QR للمدارس</p>
              <Link href="/admin">
                <Button className="w-full bg-samaya-navy hover:bg-samaya-navy/90">إدارة النقاط</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mobile Scan Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="samaya-navy">مسح النقاط</CardTitle>
              <p className="text-sm text-muted-foreground">Mobile Scanner</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">واجهة المنفذين لمسح نقاط التفتيش في الميدان</p>
              <Link href="/scan">
                <Button className="w-full bg-samaya-navy hover:bg-samaya-navy/90">بدء المسح</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
