import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .order('appointment_date', { ascending: true })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ bookings: data })
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const {
    service_id,
    tier,
    client_name,
    client_email,
    client_phone,
    appointment_date,
    appointment_time,
    notes,
    inspo_image_url
  } = body

  if (!service_id || !client_name?.trim() || !appointment_date || !appointment_time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      service_id,
      tier: tier || null,
      client_name: client_name.trim(),
      client_email: client_email?.trim() || '',
      client_phone: client_phone?.trim() || '',
      appointment_date,
      appointment_time,
      notes: notes || '',
      inspo_image_url: inspo_image_url || '',
      status: 'confirmed'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ booking: data })
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabaseAdmin.from('bookings').delete().eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { id, ...updates } = body
  const { error } = await supabaseAdmin.from('bookings').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })

  if (updates.status === 'confirmed' && updates.final_price) {
    const { data: booking } = await supabaseAdmin.from('bookings').select('*').eq('id', id).single()
    if (booking) {
      await resend.emails.send({
        from: 'bababui nails <onboarding@resend.dev>',
        to: booking.client_email,
        subject: 'Your appointment is confirmed!',
        html: `
          <p>Hi ${booking.client_name},</p>
          <p>Your appointment on <strong>${booking.appointment_date}</strong> at <strong>${booking.appointment_time}</strong> has been confirmed!</p>
          <p><strong>Final price: $${updates.final_price}</strong></p>
          <p>Payment will be collected in person. See you soon! ✨</p>
          <p>— brooke</p>
        `,
      })
    }
  }

  return NextResponse.json({ success: true })
}