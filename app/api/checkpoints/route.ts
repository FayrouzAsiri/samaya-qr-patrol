import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data: checkpoints, error } = await supabase
    .from("checkpoints")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(checkpoints)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  // Generate unique token
  const token = `CHK${Date.now().toString().slice(-6)}`
  const qr_url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://samaya-qr.vercel.app"}/scan/${token}`

  const { data: checkpoint, error } = await supabase
    .from("checkpoints")
    .insert({
      ...body,
      token,
      qr_url,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(checkpoint)
}
