import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data: workingHours } = await supabaseAdmin
    .from('working_hours')
    .select('*')
    .eq('is_active', true)

  const { data: blockedDates } = await supabaseAdmin
    .from('blocked_dates')
    .select('blocked_date, blocked_time')

  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('appointment_date')
    .neq('status', 'cancelled')

  const bookedDates = new Set(bookings?.map(b => b.appointment_date) || [])

  const dates: string[] = []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const daysToShow = 30

  for (let i = 2; i <= daysToShow; i++) {
    const d = new Date(today); d.setDate(today.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const hasWorkingHours = workingHours?.some(wh => wh.day_of_week === d.getDay())
    const isFullyBlocked = blockedDates?.some(b => b.blocked_date === dateStr && !b.blocked_time)
    const isBooked = bookedDates.has(dateStr)
    if (hasWorkingHours && !isFullyBlocked && !isBooked) dates.push(dateStr)
  }

  return NextResponse.json({ dates })
}