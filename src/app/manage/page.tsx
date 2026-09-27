'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Star = ({ size = 16 }: { size?: number }) => (
  <img src="/star.png" alt="star" width={size} height={size}
    style={{ filter: 'invert(60%) sepia(30%) saturate(500%) hue-rotate(180deg) brightness(90%)', display: 'inline-block' }} />
)

export default function ManagePage() {
  const [email, setEmail] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<'cancel' | 'reschedule' | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [availableDates, setAvailableDates] = useState<{ dateStr: string; date: Date }[]>([])
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (action !== 'reschedule') return
    // Build available dates for next 2 months
    const fetchDates = async () => {
      const res = await fetch('/api/availability/dates')
      if (res.ok) {
        const { dates } = await res.json()
        setAvailableDates(dates.map((d: string) => ({ dateStr: d, date: new Date(d + 'T00:00:00') })))
      }
    }
    fetchDates()
  }, [action])

  const fetchTimes = async (date: string) => {
    setNewDate(date)
    setNewTime('')
    const res = await fetch(`/api/availability?date=${date}`)
    const { bookings: existingBookings, blockedRanges, fullDayBlocked, customHours } = await res.json()
    if (fullDayBlocked) { setAvailableTimes([]); return }

    // Get working hours
    const whRes = await fetch('/api/availability/hours')
    const { workingHours } = await whRes.json()
    const dayOfWeek = new Date(date + 'T00:00:00').getDay()
    const hours = workingHours.find((wh: any) => wh.day_of_week === dayOfWeek && wh.is_active)

    // Use custom hours override if one exists for this date, otherwise fall back to the weekday default
    const activeHours = customHours || hours
    if (!activeHours) { setAvailableTimes([]); return }

    const blockedMins = new Set<number>()
    existingBookings?.forEach((b: any) => {
      const [h, m] = b.appointment_time.substring(0, 5).split(':').map(Number)
      const start = h * 60 + m
      for (let i = 0; i < 210; i += 30) blockedMins.add(start + i)
    })
    blockedRanges?.forEach((range: any) => {
      const [sh, sm] = range.start.split(':').map(Number)
      const startM = sh * 60 + sm
      if (range.end) {
        const [eh, em] = range.end.split(':').map(Number)
        const endM = eh * 60 + em
        for (let m = startM; m < endM; m += 30) blockedMins.add(m)
      } else {
        blockedMins.add(startM)
      }
    })

    const slots: string[] = []
    const [startH, startM] = activeHours.start_time.split(':').map(Number)
    const [endH, endM] = activeHours.end_time.split(':').map(Number)
    const startMins = startH * 60 + startM
    const endMins = endH * 60 + endM
    for (let m = startMins; m <= endMins; m += 30) {
      const h = Math.floor(m / 60).toString().padStart(2, '0')
      const min = (m % 60).toString().padStart(2, '0')
      if (!blockedMins.has(m)) slots.push(`${h}:${min}`)
    }
    setAvailableTimes(slots)
  }

  const handleLookup = async () => {
    setLoading(true)
    setError('')
    setBooking(null)
    const res = await fetch(`/api/manage?email=${encodeURIComponent(email)}&id=${encodeURIComponent(bookingId)}`)
    const data = await res.json()
    if (!res.ok || !data.booking) {
      setError('No booking found. Please check your email and booking ID.')
    } else {
      setBooking(data.booking)
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: booking.id,
        action,
        new_date: newDate,
        new_time: newTime,
        message,
        client_email: booking.client_email,
        client_name: booking.client_name,
      }),
    })
    if (res.ok) setSubmitted(true)
    setLoading(false)
  }

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
  }

  return (
    <div className="min-h-screen gradient-book">
      <nav className="flex justify-between items-center px-6 py-4 border-b border-stone-400/50">
        <Link href="/" className="script text-xl text-stone-800 flex-shrink-0">bababui nails</Link>
        <div className="flex gap-4 text-xs tracking-widest">
          <Link href="/gallery" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">gallery</Link>
          <Link href="/pricing" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">pricing</Link>
          <Link href="/policy" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">policy</Link>
          <Link href="/book" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">book</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4"><Star size={14} /><Star size={20} /><Star size={14} /></div>
          <h1 className="script text-6xl text-stone-900 mb-3">manage booking</h1>
          <p className="jost text-xs tracking-widest text-[#0f3282] uppercase font-medium">cancel or reschedule</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4"><Star size={14} /><Star size={22} /><Star size={14} /></div>
            <h2 className="script text-4xl text-stone-900">request sent!</h2>
            <p className="jost text-stone-500 text-sm">Brooke will be in touch to confirm your {action}.</p>
          </div>
        ) : !booking ? (
          <div className="space-y-4">
            <div>
              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-2">email address</p>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="the email you booked with"
                className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl" />
            </div>
            <div>
              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-2">booking ID</p>
              <input type="text" value={bookingId} onChange={e => setBookingId(e.target.value)}
                placeholder="from your confirmation email"
                className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl" />
            </div>
            {error && <p className="jost text-sm text-red-400">{error}</p>}
            <button onClick={handleLookup} disabled={loading || !email || !bookingId}
              className="jost w-full py-3 bg-[#0f3282] text-white text-xs tracking-widest uppercase disabled:opacity-40 hover:bg-[#8BA7C7] transition-colors rounded-xl">
              {loading ? 'looking up...' : 'find booking'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border border-[#8BA7C7] bg-white/50 rounded-xl p-6 space-y-3">
              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">your booking</p>
              <div className="flex justify-between text-sm border-b border-stone-400/30 pb-2">
                <span className="jost text-stone-500">date</span>
                <span className="jost text-stone-900">{booking.appointment_date}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-stone-400/30 pb-2">
                <span className="jost text-stone-500">time</span>
                <span className="jost text-stone-900">{booking.appointment_time}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-stone-400/30 pb-2">
                <span className="jost text-stone-500">status</span>
                <span className="jost text-stone-900 capitalize">{booking.status}</span>
              </div>
            </div>

            {!action ? (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setAction('reschedule')}
                  className="jost p-4 border border-[#8BA7C7] bg-[#8BA7C7]/20 text-stone-700 text-sm rounded-xl hover:bg-[#8BA7C7]/40 transition-all">
                  reschedule
                </button>
                <button onClick={() => setAction('cancel')}
                  className="jost p-4 border border-red-300 bg-red-50 text-red-400 text-sm rounded-xl hover:bg-red-100 transition-all">
                  cancel
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium">
                  {action === 'cancel' ? 'confirm cancellation' : 'request reschedule'}
                </p>

                {action === 'reschedule' && (
                  <>
                    <div>
                      <p className="jost text-xs text-stone-500 mb-3">select a new date</p>
                      {(() => {
                        const months: Record<string, typeof availableDates> = {}
                        availableDates.forEach(d => {
                          const month = d.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
                          if (!months[month]) months[month] = []
                          months[month].push(d)
                        })
                        return Object.entries(months).map(([month, dates]) => (
                          <div key={month} className="mb-4">
                            <p className="jost text-xs text-stone-400 uppercase tracking-widest mb-2">{month}</p>
                            <div className="grid grid-cols-4 gap-2">
                              {dates.map(({ dateStr, date: d }) => (
                                <button key={dateStr} onClick={() => fetchTimes(dateStr)}
                                  className={`jost p-3 border transition-all flex flex-col items-center rounded-xl text-sm ${
                                    newDate === dateStr
                                      ? 'border-[#8BA7C7] bg-[#8BA7C7] text-white'
                                      : 'border-[#8BA7C7] bg-[#8BA7C7]/20 text-stone-700 hover:bg-[#8BA7C7]/40'
                                  }`}>
                                  <span className={`text-xs uppercase ${newDate === dateStr ? 'text-white/70' : 'text-stone-400'}`}>
                                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                  </span>
                                  <span>{d.getDate()}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>

                    {newDate && availableTimes.length > 0 && (
                      <div>
                        <p className="jost text-xs text-stone-500 mb-2">select a time</p>
                        <select value={newTime} onChange={e => setNewTime(e.target.value)}
                          className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl">
                          <option value="">choose a time slot...</option>
                          {availableTimes.map(t => (
                            <option key={t} value={t}>{formatTime(t)}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {newDate && availableTimes.length === 0 && (
                      <p className="jost text-sm text-red-400">No available times for this date.</p>
                    )}
                  </>
                )}

                <div>
                  <p className="jost text-xs text-stone-500 mb-2">message (optional)</p>
                  <textarea value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="any additional details..."
                    className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 resize-none h-20 focus:outline-none focus:border-[#0f3282] rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setAction(null)}
                    className="jost p-3 border border-stone-400/50 text-stone-500 text-sm rounded-xl hover:bg-stone-100 transition-all">
                    back
                  </button>
                  <button onClick={handleSubmit}
                    disabled={loading || (action === 'reschedule' && (!newDate || !newTime))}
                    className="jost p-3 bg-[#0f3282] text-white text-sm rounded-xl disabled:opacity-40 hover:bg-[#8BA7C7] transition-colors">
                    {loading ? 'sending...' : `confirm ${action}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="py-12 px-8 text-center border-t border-stone-400/50">
        <div className="flex items-center justify-center gap-3 mb-4"><Star size={10} /><Star size={16} /><Star size={10} /></div>
        <p className="jost text-xs text-stone-500 tracking-widest">© 2026 bababui nails · calgary, ab</p>
      </footer>
    </div>
  )
}