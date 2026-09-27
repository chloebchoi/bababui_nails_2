import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const action = searchParams.get('action')
  const new_date = searchParams.get('new_date')
  const new_time = searchParams.get('new_time')
  const client_email = searchParams.get('client_email')
  const client_name = searchParams.get('client_name')

  if (!id || !action || !client_email || !client_name) {
    return new NextResponse('Missing fields', { status: 400 })
  }

  if (action === 'accept' && new_date && new_time) {
    await supabaseAdmin
      .from('bookings')
      .update({ appointment_date: new_date, appointment_time: new_time, status: 'confirmed' })
      .eq('id', id)

    await resend.emails.send({
      from: 'bababui nails <onboarding@resend.dev>',
      to: client_email,
      subject: 'Your reschedule has been confirmed!',
      html: `
        <p>Hi ${client_name},</p>
        <p>Your appointment has been rescheduled!</p>
        <p><strong>New date:</strong> ${new_date}</p>
        <p><strong>New time:</strong> ${new_time}</p>
        <p>See you soon! ✨</p>
        <p>— brooke</p>
      `,
    })

    return new NextResponse(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h2 style="color:#0f3282">✓ Reschedule accepted!</h2>
        <p>${client_name}'s appointment has been updated to ${new_date} at ${new_time}.</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  if (action === 'decline') {
    await resend.emails.send({
      from: 'bababui nails <onboarding@resend.dev>',
      to: client_email,
      subject: 'Your reschedule request was declined',
      html: `
        <p>Hi ${client_name},</p>
        <p>Unfortunately your reschedule request could not be accommodated.</p>
        <p>Please DM <a href="https://www.instagram.com/bababui.nails">@bababui.nails</a> on Instagram or <a href="https://bababui-nails-2.vercel.app/manage">visit your booking</a> to try a different time.</p>
        <p>— brooke</p>
        `,
    })

    return new NextResponse(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h2 style="color:#ef4444">✗ Reschedule declined</h2>
        <p>${client_name} has been notified.</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  if (action === 'cancel_confirm') {
    await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)

    await resend.emails.send({
      from: 'bababui nails <onboarding@resend.dev>',
      to: client_email,
      subject: 'Your appointment has been cancelled',
      html: `
        <p>Hi ${client_name},</p>
        <p>Your appointment has been cancelled.</p>
        <p>We hope to see you again soon! <a href="https://bababui-nails-2.vercel.app/book">Book a new appointment</a> or DM <a href="https://www.instagram.com/bababui.nails">@bababui.nails</a> on Instagram.</p>
        <p>— brooke</p>
        `,
    })

    return new NextResponse(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h2 style="color:#ef4444">Cancellation confirmed</h2>
        <p>${client_name}'s appointment has been cancelled.</p>
      </body></html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  return new NextResponse('Invalid action', { status: 400 })
}