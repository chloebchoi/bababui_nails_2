'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Booking } from '@/types'
import Image from 'next/image'

const TIERS = ['tier 0', 'tier 1', 'tier 2', 'tier 3', 'tier 4', 'tier 5']

type ServiceOption = {
  id: string
  label: string
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [finalPrice, setFinalPrice] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [addSaving, setAddSaving] = useState(false)
  const [addError, setAddError] = useState('')
  const [newServiceId, setNewServiceId] = useState('')
  const [newTier, setNewTier] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newInspoImage, setNewInspoImage] = useState<File | null>(null)

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
  }

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || ''
  }

  const fetchBookings = async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const { bookings } = await res.json()
    if (bookings) setBookings(bookings)
    setLoading(false)
  }

  const fetchServiceOptions = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, service_types(name, categories(name))')

    if (data) {
      const options = data.map((s: any) => ({
        id: s.id,
        label: [
          s.service_types?.categories?.name,
          s.service_types?.name,
          s.name
        ]
          .filter(Boolean)
          .join(' — ')
      }))
      setServiceOptions(options)
    }
  }

  useEffect(() => {
    checkAuth()
    fetchBookings()
    fetchServiceOptions()
  }, [])

  const handleSelect = (booking: Booking) => {
    setSelected(booking)
    setFinalPrice(booking.final_price?.toString() || '')
    setStatus(booking.status)
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    const token = await getToken()
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: selected.id,
        final_price: finalPrice ? parseFloat(finalPrice) : null,
        status,
      }),
    })
    await fetchBookings()
    setSelected(null)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return
    setDeleting(true)
    const token = await getToken()
    await fetch(`/api/admin/bookings?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchBookings()
    setSelected(null)
    setDeleting(false)
  }

  const resetAddForm = () => {
    setNewServiceId('')
    setNewTier('')
    setNewDate('')
    setNewTime('')
    setNewClientName('')
    setNewClientEmail('')
    setNewClientPhone('')
    setNewNotes('')
    setNewInspoImage(null)
    setAddError('')
  }

  const handleAddBooking = async () => {
    if (!newServiceId || !newDate || !newTime || !newClientName.trim()) {
      setAddError('Service, date, time, and client name are required.')
      return
    }

    setAddSaving(true)
    setAddError('')

    let imageUrl = ''

    if (newInspoImage) {
      const ext = newInspoImage.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('inspo-images')
        .upload(fileName, newInspoImage)

      if (!uploadError) {
        const { data } = supabase.storage
          .from('inspo-images')
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }
    }

    const token = await getToken()
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        service_id: newServiceId,
        tier: newTier,
        client_name: newClientName.trim(),
        client_email: newClientEmail.trim(),
        client_phone: newClientPhone.trim(),
        appointment_date: newDate,
        appointment_time: newTime,
        notes: newNotes.trim(),
        inspo_image_url: imageUrl
      })
    })

    if (res.ok) {
      await fetchBookings()
      resetAddForm()
      setShowAddModal(false)
    } else {
      const { error } = await res.json()
      setAddError(error?.message || 'Failed to add booking.')
    }

    setAddSaving(false)
  }

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'text-green-600'
    if (s === 'completed') return 'text-stone-400'
    if (s === 'cancelled') return 'text-red-400'
    return 'text-yellow-600'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <p className="text-stone-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs tracking-widest text-stone-400 uppercase mb-1">bababui nails</p>
            <h1 className="text-3xl font-light text-stone-800">Bookings</h1>
          </div>

          <button
            onClick={() => {
              resetAddForm()
              setShowAddModal(true)
            }}
            className="px-4 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 transition-colors"
          >
            + Add Booking
          </button>
        </div>

        {bookings.length === 0 && (
          <p className="text-stone-400 text-sm">No bookings yet.</p>
        )}

        <div className="space-y-3">
          {bookings.map(booking => (
            <div
              key={booking.id}
              onClick={() => handleSelect(booking)}
              className="bg-white border border-stone-200 rounded-xl p-5 cursor-pointer hover:border-stone-400 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-stone-800 font-medium">{booking.client_name}</p>
                  <p className="text-stone-400 text-sm mt-1">{booking.appointment_date} at {booking.appointment_time}</p>
                  <p className="text-stone-400 text-sm capitalize">{booking.tier || 'no tier'}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <p className={`text-sm font-medium capitalize ${statusColor(booking.status)}`}>{booking.status}</p>
                    {booking.final_price && (
                      <p className="text-stone-500 text-sm mt-1">${booking.final_price}</p>
                    )}
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(booking.id)
                    }}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-stone-800">{selected.client_name}</h2>
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 text-xl">X</button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Email</span>
                <span className="text-stone-700">{selected.client_email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Phone</span>
                <span className="text-stone-700">{selected.client_phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Date</span>
                <span className="text-stone-700">{selected.appointment_date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Time</span>
                <span className="text-stone-700">{selected.appointment_time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Tier</span>
                <span className="text-stone-700 capitalize">{selected.tier || 'no tier'}</span>
              </div>
              {selected.notes && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Notes</span>
                  <span className="text-stone-700">{selected.notes}</span>
                </div>
              )}
            </div>

            {selected.inspo_image_url && (
              <div className="mb-6">
                <p className="text-sm text-stone-400 mb-2">Inspo Image</p>
                <Image
                  src={selected.inspo_image_url}
                  alt="Inspo"
                  width={400}
                  height={400}
                  className="w-full rounded-lg object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-400 mb-2">Final Price ($)</p>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={e => setFinalPrice(e.target.value)}
                  placeholder="e.g. 85"
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <p className="text-sm text-stone-400 mb-2">Status</p>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-stone-800 text-white text-sm rounded-lg disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={deleting}
                className="w-full py-3 border border-red-300 text-red-500 text-sm rounded-lg disabled:opacity-40 hover:bg-red-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-stone-800">Add Booking</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-xl"
              >
                X
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-stone-400 mb-2">Service</p>
                <select
                  value={newServiceId}
                  onChange={e => setNewServiceId(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                >
                  <option value="">select a service...</option>
                  {serviceOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm text-stone-400 mb-2">Design Tier</p>
                <select
                  value={newTier}
                  onChange={e => setNewTier(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                >
                  <option value="">none (e.g. full removal)</option>
                  {TIERS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm text-stone-400 mb-2">Inspo Image (optional)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setNewInspoImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:border file:border-stone-200 file:rounded-lg file:text-sm file:bg-stone-100 file:text-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-stone-400 mb-2">Date</p>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <p className="text-sm text-stone-400 mb-2">Time</p>
                  <input
                    type="time"
                    step="1800"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-stone-400 mb-2">Client Name</p>
                <input
                  type="text"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  placeholder="full name"
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <p className="text-sm text-stone-400 mb-2">Client Email (optional)</p>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={e => setNewClientEmail(e.target.value)}
                  placeholder="email address"
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <p className="text-sm text-stone-400 mb-2">Client Phone (optional)</p>
                <input
                  type="tel"
                  value={newClientPhone}
                  onChange={e => setNewClientPhone(e.target.value)}
                  placeholder="phone number"
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div>
                <p className="text-sm text-stone-400 mb-2">Notes (optional)</p>
                <textarea
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-700 resize-none h-20 focus:outline-none focus:border-stone-400"
                />
              </div>

              {addError && (
                <p className="text-sm text-red-500">{addError}</p>
              )}

              <button
                onClick={handleAddBooking}
                disabled={addSaving}
                className="w-full py-3 bg-stone-800 text-white text-sm rounded-lg disabled:opacity-40"
              >
                {addSaving ? 'Adding...' : 'Add Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}