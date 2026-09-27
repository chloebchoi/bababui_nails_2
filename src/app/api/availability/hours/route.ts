import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data: workingHours } = await supabaseAdmin
    .from('working_hours')
    .select('*')
    .eq('is_active', true)

  return NextResponse.json({ workingHours: workingHours || [] })
}