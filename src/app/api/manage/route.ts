import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const NAIL_TECH_EMAIL = 'bababuinails@gmail.com'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const id = searchParams.get('id')

  if (!email || !id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('id', id)
    .eq('client_email', email)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ booking: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, action, new_date, new_time, message, client_email, client_name } = body

  await resend.emails.send({
    from: 'bababui nails <onboarding@resend.dev>',
    to: NAIL_TECH_EMAIL,
    subject: `Booking ${action} request from ${client_name}`,
    html: `
      <p><strong>${client_name}</strong> has requested to <strong>${action}</strong> their booking.</p>
      <p><strong>Booking ID:</strong> ${id}</p>
      <p><strong>Client email:</strong> ${client_email}</p>
      ${action === 'reschedule' ? `
        <p><strong>Preferred new date:</strong> ${new_date}</p>
        <p><strong>Preferred new time:</strong> ${new_time}</p>
        <p>
          <a href="https://bababui-nails-2.vercel.app/api/manage/respond?id=${id}&action=accept&new_date=${new_date}&new_time=${new_time}&client_email=${encodeURIComponent(client_email)}&client_name=${encodeURIComponent(client_name)}" 
            style="background:#0f3282;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;margin-right:10px;">
            ✓ Accept
          </a>
          <a href="https://bababui-nails-2.vercel.app/api/manage/respond?id=${id}&action=decline&client_email=${encodeURIComponent(client_email)}&client_name=${encodeURIComponent(client_name)}"
            style="background:#ef4444;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">
            ✗ Decline
          </a>
        </p>
      ` : `
        <p>
          <a href="https://bababui-nails-2.vercel.app/api/manage/respond?id=${id}&action=cancel_confirm&client_email=${encodeURIComponent(client_email)}&client_name=${encodeURIComponent(client_name)}"
            style="background:#ef4444;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">
            ✓ Confirm Cancellation
          </a>
        </p>
      `}
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
    `,
  })

  return NextResponse.json({ success: true })
}