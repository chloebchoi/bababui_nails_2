'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

type WorkingHours = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

type BlockedDate = {
  id: string
  blocked_date: string
  blocked_time: string | null
  blocked_time_end: string | null
  reason: string | null
}

type CustomHours = {
  id: string
  date: string
  start_time: string
  end_time: string
}

export default function AvailabilityPage() {
  const router = useRouter()

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [customHours, setCustomHours] = useState<CustomHours[]>([])

  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')

  const [blockType, setBlockType] =
    useState<'single' | 'range'>('single')

  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')

  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')

  const [newCustomDate, setNewCustomDate] = useState('')
  const [newCustomStart, setNewCustomStart] = useState('')
  const [newCustomEnd, setNewCustomEnd] = useState('')

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // --------------------------------------------------
  // LOCAL DATE HELPER
  // --------------------------------------------------

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const todayString = () => {
    return formatLocalDate(new Date())
  }

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  const getSession = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return null
    }

    if (!session) {
      router.push('/admin/login')
      return null
    }

    return session
  }

  const getToken = async () => {
    const session = await getSession()
    if (!session) return null
    return session.access_token
  }

  // --------------------------------------------------
  // FETCH DATA
  // --------------------------------------------------

  const fetchData = async () => {
    try {
      setError('')

      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/admin/availability', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Availability API error:', res.status, errorText)
        setError(`Failed to load availability (${res.status}).`)
        return
      }

      const data = await res.json()
      console.log('Availability data:', data)

      if (Array.isArray(data.workingHours)) {
        setWorkingHours(data.workingHours)
      } else {
        setWorkingHours([])
      }

      if (Array.isArray(data.blockedDates)) {
        setBlockedDates(data.blockedDates)
      } else {
        setBlockedDates([])
      }

      if (Array.isArray(data.customHours)) {
        setCustomHours(data.customHours)
      } else {
        setCustomHours([])
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
      setError('Unable to load availability. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const session = await getSession()
      if (!session || !mounted) return
      await fetchData()
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  // --------------------------------------------------
  // UPDATE WORKING HOURS
  // --------------------------------------------------

  const updateWorkingHours = async (
    id: string,
    updates: Partial<WorkingHours>
  ) => {
    try {
      setError('')

      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/admin/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Update working hours error:', res.status, errorText)
        setError('Failed to update working hours.')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Error updating working hours:', error)
      setError('Failed to update working hours.')
    }
  }

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------

  const formatTime = (t: string) => {
    if (!t) return ''

    const [h, m] = t.substring(0, 5).split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h

    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
  }

  // --------------------------------------------------
  // CREATE DATE LIST
  // --------------------------------------------------

  const getDatesToBlock = () => {
    if (blockType === 'single') {
      return newBlockedDate ? [newBlockedDate] : []
    }

    if (!rangeStart || !rangeEnd) return []

    const dates: string[] = []
    const start = new Date(`${rangeStart}T00:00:00`)
    const end = new Date(`${rangeEnd}T00:00:00`)

    if (start > end) return []

    const current = new Date(start)

    while (current <= end) {
      dates.push(formatLocalDate(current))
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  // --------------------------------------------------
  // ADD BLOCKED DATE
  // --------------------------------------------------

  const addBlockedDate = async () => {
    if (blockType === 'single' && !newBlockedDate) return
    if (blockType === 'range' && (!rangeStart || !rangeEnd)) return

    if (blockType === 'range' && rangeStart > rangeEnd) {
      setError('The end date must be after the start date.')
      return
    }

    if (timeStart && timeEnd && timeStart >= timeEnd) {
      setError('The end time must be after the start time.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const token = await getToken()
      if (!token) return

      const dates = getDatesToBlock()

      if (dates.length === 0) {
        setError('Please select a date.')
        return
      }

      for (const dateStr of dates) {
        const payload = {
          blocked_date: dateStr,
          blocked_time: timeStart || null,
          blocked_time_end: timeEnd || null,
          reason: newBlockedReason.trim() || null,
        }

        console.log('Creating blocked date:', payload)

        const res = await fetch('/api/admin/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Failed to block date:', res.status, errorText)
          throw new Error(`Failed to block ${dateStr}`)
        }
      }

      // Reset form
      setNewBlockedDate('')
      setRangeStart('')
      setRangeEnd('')
      setTimeStart('')
      setTimeEnd('')
      setNewBlockedReason('')

      // Reload data
      await fetchData()
    } catch (error) {
      console.error('Error adding blocked date:', error)
      setError(error instanceof Error ? error.message : 'Failed to block date.')
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // REMOVE BLOCKED DATE
  // --------------------------------------------------

  const removeBlockedDate = async (id: string) => {
    try {
      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/admin/availability', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Failed to remove blocked date:', res.status, errorText)
        setError('Failed to remove blocked date.')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Error removing blocked date:', error)
      setError('Failed to remove blocked date.')
    }
  }

  // --------------------------------------------------
  // REMOVE ALL BLOCKS FOR DATE
  // --------------------------------------------------

  const removeAllForDate = async (entries: BlockedDate[]) => {
    if (entries.length === 0) return

    try {
      setSaving(true)
      setError('')

      const token = await getToken()
      if (!token) return

      for (const entry of entries) {
        const res = await fetch('/api/admin/availability', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: entry.id }),
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Failed to remove:', res.status, errorText)
          throw new Error('Failed to remove blocked date.')
        }
      }

      await fetchData()
    } catch (error) {
      console.error('Error removing blocked dates:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to remove blocked dates.'
      )
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // ADD CUSTOM HOURS
  // --------------------------------------------------

  const addCustomHours = async () => {
    if (!newCustomDate || !newCustomStart || !newCustomEnd) {
      setError('Please fill in date, start time, and end time.')
      return
    }

    if (newCustomStart >= newCustomEnd) {
      setError('The end time must be after the start time.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          table: 'custom_hours',
          date: newCustomDate,
          start_time: newCustomStart,
          end_time: newCustomEnd,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Failed to add custom hours:', res.status, errorText)
        throw new Error('Failed to save custom hours.')
      }

      setNewCustomDate('')
      setNewCustomStart('')
      setNewCustomEnd('')

      await fetchData()
    } catch (error) {
      console.error('Error adding custom hours:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to save custom hours.'
      )
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // REMOVE CUSTOM HOURS
  // --------------------------------------------------

  const removeCustomHours = async (id: string) => {
    try {
      setSaving(true)
      setError('')

      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/admin/availability', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, table: 'custom_hours' }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Failed to remove custom hours:', res.status, errorText)
        setError('Failed to remove custom hours.')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Error removing custom hours:', error)
      setError('Failed to remove custom hours.')
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // GROUP BLOCKED DATES
  // --------------------------------------------------

  const groupedBlockedDates = blockedDates.reduce((acc, bd) => {
    if (!acc[bd.blocked_date]) {
      acc[bd.blocked_date] = []
    }

    acc[bd.blocked_date].push(bd)

    return acc
  }, {} as Record<string, BlockedDate[]>)

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-light text-stone-800 mb-10">
          Availability
        </h1>

        <p className="text-sm text-stone-400">
          Loading availability...
        </p>
      </div>
    )
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-light text-stone-800 mb-10">
        Availability
      </h1>

      {/* ERROR */}

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-500">
            {error}
          </p>

          <button
            onClick={() => {
              setError('')
              setLoading(true)
              fetchData()
            }}
            className="mt-2 text-xs underline text-red-500"
          >
            Try again
          </button>
        </div>
      )}

      {/* ==========================================
          WORKING HOURS
      ========================================== */}

      <div className="mb-12">

        <p className="text-xs tracking-widest text-stone-400 uppercase mb-6">
          Working Hours
        </p>

        <div className="space-y-3">

          {DAYS.map((day, index) => {
            const hours = workingHours.find(
              wh => wh.day_of_week === index
            )

            if (!hours) return null

            return (
              <div
                key={hours.id}
                className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4 flex-wrap"
              >

                <div className="w-24">
                  <p className="text-sm text-stone-700">
                    {day}
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={hours.is_active}
                    onChange={e =>
                      updateWorkingHours(hours.id, {
                        is_active: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />

                  <span className="text-sm text-stone-400">
                    Active
                  </span>

                </label>

                {hours.is_active && (
                  <>
                    <input
                      type="time"
                      value={hours.start_time}
                      onChange={e =>
                        updateWorkingHours(hours.id, {
                          start_time: e.target.value,
                        })
                      }
                      className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                    />

                    <span className="text-stone-400 text-sm">
                      to
                    </span>

                    <input
                      type="time"
                      value={hours.end_time}
                      onChange={e =>
                        updateWorkingHours(hours.id, {
                          end_time: e.target.value,
                        })
                      }
                      className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                    />
                  </>
                )}

              </div>
            )
          })}

        </div>

      </div>

      {/* ==========================================
          CUSTOM HOURS (ONE-OFF OVERRIDES)
      ========================================== */}

      <div className="mb-12">

        <p className="text-xs tracking-widest text-stone-400 uppercase mb-6">
          Custom Hours
        </p>

        {/* ADD CUSTOM HOURS */}

        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4 space-y-3">

          <p className="text-sm text-stone-500">
            Override the hours for a specific date (e.g. a holiday with different availability)
          </p>

          <div className="flex gap-3 flex-wrap">

            <input
              type="date"
              value={newCustomDate}
              min={todayString()}
              onChange={e => setNewCustomDate(e.target.value)}
              className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />

            <input
              type="time"
              value={newCustomStart}
              onChange={e => setNewCustomStart(e.target.value)}
              className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />

            <span className="text-stone-400 text-sm self-center">
              to
            </span>

            <input
              type="time"
              value={newCustomEnd}
              onChange={e => setNewCustomEnd(e.target.value)}
              className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />

          </div>

          <button
            type="button"
            onClick={addCustomHours}
            disabled={
              saving ||
              !newCustomDate ||
              !newCustomStart ||
              !newCustomEnd
            }
            className="px-4 py-2 bg-stone-800 text-white text-sm rounded-lg disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Set Custom Hours'}
          </button>

        </div>

        {/* EXISTING CUSTOM HOURS */}

        <div className="space-y-2">

          {customHours.length === 0 && (
            <p className="text-stone-400 text-sm">
              No custom hours set.
            </p>
          )}

          {customHours
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(ch => (
              <div
                key={ch.id}
                className="bg-white border border-stone-200 rounded-xl p-4 flex justify-between items-center gap-4"
              >

                <p className="text-sm text-stone-700">
                  {ch.date} · {formatTime(ch.start_time)} – {formatTime(ch.end_time)}
                </p>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => removeCustomHours(ch.id)}
                  className="text-red-400 hover:text-red-600 text-sm disabled:opacity-40"
                >
                  Remove
                </button>

              </div>
            ))}

        </div>

      </div>

      {/* ==========================================
          BLOCKED DATES
      ========================================== */}

      <div>

        <p className="text-xs tracking-widest text-stone-400 uppercase mb-6">
          Blocked Dates
        </p>

        {/* ADD BLOCK */}

        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4 space-y-3">

          <p className="text-sm text-stone-500">
            Block a date or specific time range
          </p>

          {/* TYPE */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => setBlockType('single')}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                blockType === 'single'
                  ? 'bg-stone-800 text-white'
                  : 'border border-stone-200 text-stone-500'
              }`}
            >
              Single Date
            </button>

            <button
              type="button"
              onClick={() => setBlockType('range')}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                blockType === 'range'
                  ? 'bg-stone-800 text-white'
                  : 'border border-stone-200 text-stone-500'
              }`}
            >
              Date Range
            </button>

          </div>

          {/* DATES */}

          <div className="flex gap-3 flex-wrap">

            {blockType === 'single' ? (
              <input
                type="date"
                value={newBlockedDate}
                min={todayString()}
                onChange={e => setNewBlockedDate(e.target.value)}
                className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
              />
            ) : (
              <>
                <input
                  type="date"
                  value={rangeStart}
                  min={todayString()}
                  onChange={e => setRangeStart(e.target.value)}
                  className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                />

                <span className="text-stone-400 text-sm self-center">
                  to
                </span>

                <input
                  type="date"
                  value={rangeEnd}
                  min={rangeStart || todayString()}
                  onChange={e => setRangeEnd(e.target.value)}
                  className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                />
              </>
            )}

            {/* TIME START */}

            <input
              type="time"
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
              className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />

            <span className="text-stone-400 text-sm self-center">
              to
            </span>

            {/* TIME END */}

            <input
              type="time"
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
              className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
            />

            {/* REASON */}

            <input
              type="text"
              value={newBlockedReason}
              onChange={e => setNewBlockedReason(e.target.value)}
              placeholder="Reason (optional)"
              className="border border-stone-200 rounded-lg p-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400 flex-1 min-w-[180px]"
            />

          </div>

          {/* BLOCK BUTTON */}

          <button
            type="button"
            onClick={addBlockedDate}
            disabled={
              saving ||
              (blockType === 'single' && !newBlockedDate) ||
              (blockType === 'range' && (!rangeStart || !rangeEnd))
            }
            className="px-4 py-2 bg-stone-800 text-white text-sm rounded-lg disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Block Date'}
          </button>

        </div>

        {/* ==========================================
            EXISTING BLOCKED DATES
        ========================================== */}

        <div className="space-y-2">

          {blockedDates.length === 0 && (
            <p className="text-stone-400 text-sm">
              No blocked dates.
            </p>
          )}

          {Object.entries(groupedBlockedDates)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, entries]) => {
              return (
                <div
                  key={date}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex justify-between items-center gap-4"
                >

                  <div>

                    <p className="text-sm text-stone-700">

                      {date}

                      {entries[0].blocked_time ? (
                        <>
                          {' · '}
                          {formatTime(entries[0].blocked_time)}

                          {entries[0].blocked_time_end && (
                            <>
                              {' – '}
                              {formatTime(entries[0].blocked_time_end)}
                            </>
                          )}
                        </>
                      ) : (
                        ' (full day)'
                      )}

                    </p>

                    {entries[0].reason && (
                      <p className="text-xs text-stone-400 mt-1">
                        {entries[0].reason}
                      </p>
                    )}

                    {entries.length > 1 && (
                      <p className="text-xs text-stone-400 mt-1">
                        {entries.length} blocks on this date
                      </p>
                    )}

                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => removeAllForDate(entries)}
                    className="text-red-400 hover:text-red-600 text-sm disabled:opacity-40"
                  >
                    Remove
                  </button>

                </div>
              )
            })}

        </div>

      </div>

    </div>
  )
}