import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data: scans, error } = await supabase
    .from("scans")
    .select(`
      *,
      checkpoints (
        name_ar,
        name_en,
        location,
        school,
        city
      )
    `)
    .order("scanned_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(scans)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { data: scan, error } = await supabase
    .from("scans")
    .insert(body)
    .select(`
      *,
      checkpoints (
        name_ar,
        name_en,
        location,
        school,
        city
      )
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(scan)
}
