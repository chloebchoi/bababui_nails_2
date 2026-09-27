import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  if (!start || !end) return NextResponse.json({ dates: [] })

  const { data } = await supabaseAdmin
    .from('bookings')
    .select('appointment_date')
    .gte('appointment_date', start)
    .lte('appointment_date', end)
    .or('status.is.null,status.neq.cancelled')

  const dates = Array.from(new Set((data || []).map(b => b.appointment_date)))

  return NextResponse.json({ dates })
}