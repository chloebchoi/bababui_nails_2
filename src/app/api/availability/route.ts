import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ bookings: [], blockedRanges: [], fullDayBlocked: false, customHours: null })

  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('appointment_time')
    .eq('appointment_date', date)
    .neq('status', 'cancelled')

  const { data: blocked } = await supabaseAdmin
    .from('blocked_dates')
    .select('blocked_time, blocked_time_end')
    .eq('blocked_date', date)

  const { data: custom } = await supabaseAdmin
    .from('custom_hours')
    .select('start_time, end_time')
    .eq('date', date)
    .single()

  const fullDayBlocked = blocked?.some(b => !b.blocked_time) || false
  const blockedRanges = blocked
    ?.filter(b => b.blocked_time)
    .map(b => ({ start: b.blocked_time!.substring(0, 5), end: b.blocked_time_end?.substring(0, 5) || null })) || []

  return NextResponse.json({
    bookings: bookings || [],
    blockedRanges,
    fullDayBlocked,
    customHours: custom ? {
      start_time: custom.start_time.substring(0, 5),
      end_time: custom.end_time.substring(0, 5)
    } : null
  })
}