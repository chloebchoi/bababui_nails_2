import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const NAIL_TECH_EMAIL = 'bababuinails@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('body:', body)

    const { data: serviceData } = await supabaseAdmin
      .from('services')
      .select('name, service_type_id')
      .eq('id', body.service_id)
      .single()

    const { data: serviceTypeData } = serviceData ? await supabaseAdmin
      .from('service_types')
      .select('name, category_id')
      .eq('id', serviceData.service_type_id)
      .single() : { data: null }

    const { data: categoryData } = serviceTypeData ? await supabaseAdmin
      .from('categories')
      .select('name')
      .eq('id', serviceTypeData.category_id)
      .single() : { data: null }

    const categoryName = categoryData?.name || ''
    const serviceTypeName = serviceTypeData?.name || ''
    const serviceName = serviceData?.name || ''
    const serviceDetails = [
      categoryName,
      serviceTypeName !== categoryName ? serviceTypeName : '',
      serviceName !== serviceTypeName ? serviceName : ''
    ].filter(Boolean).join(' — ')

    console.log('serviceData:', serviceData)
    console.log('serviceTypeData:', serviceTypeData)
    console.log('categoryData:', categoryData)
    console.log('serviceDetails:', serviceDetails)

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([{ ...body, status: 'pending' }])
      .select()
      .single()

    if (error) {
      console.log('supabase error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    console.log('booking created:', data)

    const emailToClient = await resend.emails.send({
      from: 'bababui nails <onboarding@resend.dev>',
      to: body.client_email,
      subject: 'Your appointment is booked!',
      html: `
        <p>Hi ${body.client_name},</p>
        <p>Your appointment has been booked!</p>
        <p><strong>Booking ID:</strong> ${data.id}</p>
        <p><strong>Service:</strong> ${serviceDetails}</p>
        <p><strong>Design Tier:</strong> ${body.tier}</p>
        <p><strong>Date:</strong> ${body.appointment_date}</p>
        <p><strong>Time:</strong> ${body.appointment_time}</p>
        <p><strong>Location:</strong> 30 Weston Green SW, Calgary AB. There is plenty of parking around the cul-de-sac. Please come in through the back door.</p>
        ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ''}
        <p>Please refer to my <a href="https://bababui-nails-2.vercel.app/policy">policy page</a> before your appointment.</p>
        <p>If you need to cancel or reschedule, visit <a href="https://bababui-nails-2.vercel.app/manage">bababuinails.com/manage</a> with your booking ID at least 24 hours before your appointment.</p>
        <p>See you soon! ✨</p>
        <p>— brooke</p>
      `,
    })
    console.log('client email result:', emailToClient)

    const emailToTech = await resend.emails.send({
      from: 'bababui nails <onboarding@resend.dev>',
      to: NAIL_TECH_EMAIL,
      subject: `New booking from ${body.client_name}`,
      html: `
        <p>You have a new booking!</p>
        <p><strong>Client:</strong> ${body.client_name}</p>
        <p><strong>Email:</strong> ${body.client_email}</p>
        <p><strong>Phone:</strong> ${body.client_phone}</p>
        <p><strong>Service:</strong> ${serviceDetails}</p>
        <p><strong>Design Tier:</strong> ${body.tier}</p>
        <p><strong>Date:</strong> ${body.appointment_date}</p>
        <p><strong>Time:</strong> ${body.appointment_time}</p>
        ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ''}
        ${body.inspo_image_url ? `<p><strong>Inspo image:</strong> <a href="${body.inspo_image_url}">View image</a></p>` : ''}
      `,
    })
    console.log('tech email result:', emailToTech)

    return NextResponse.json({ success: true, booking: data })
  } catch (err) {
    console.log('caught error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}