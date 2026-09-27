import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

async function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user } } = await supabase.auth.getUser(token)
  return !!user
}

export async function GET(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [{ data: workingHours }, { data: blockedDates }, { data: customHours }] = await Promise.all([
    supabaseAdmin.from('working_hours').select('*').order('day_of_week'),
    supabaseAdmin.from('blocked_dates').select('*').order('blocked_date'),
    supabaseAdmin.from('custom_hours').select('*').order('date'),
  ])
  return NextResponse.json({ workingHours, blockedDates, customHours })
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { id, table, ...updates } = body

  if (table === 'custom_hours') {
    const { error } = await supabaseAdmin.from('custom_hours').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error }, { status: 500 })
  } else {
    const { error } = await supabaseAdmin.from('working_hours').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { table, ...data } = body

  if (table === 'custom_hours') {
    const { error } = await supabaseAdmin.from('custom_hours').upsert([data], { onConflict: 'date' })
    if (error) return NextResponse.json({ error }, { status: 500 })
  } else {
    const { error } = await supabaseAdmin.from('blocked_dates').insert([data])
    if (error) return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, table } = await req.json()

  if (table === 'custom_hours') {
    const { error } = await supabaseAdmin.from('custom_hours').delete().eq('id', id)
    if (error) return NextResponse.json({ error }, { status: 500 })
  } else {
    const { error } = await supabaseAdmin.from('blocked_dates').delete().eq('id', id)
    if (error) return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}