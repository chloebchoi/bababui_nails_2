'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Category,
  ServiceType,
  Service,
  WorkingHours,
  BlockedDate,
} from '@/types'

const Star = ({ size = 16 }: { size?: number }) => (
  <img
    src="/star.png"
    alt="star"
    width={size}
    height={size}
    style={{
      filter:
        'invert(60%) sepia(30%) saturate(500%) hue-rotate(180deg) brightness(90%)',
      display: 'inline-block',
    }}
  />
)

const TIERS = [
  {
    id: 'tier 0',
    label: 'Tier 0 (+$0)',
    desc: 'One solid color, no nail art.',
  },
  {
    id: 'tier 1',
    label: 'Tier 1 (+$10)',
    desc: '1-2 solid colors, nail art on up to 2 fingers, initials.',
  },
  {
    id: 'tier 2',
    label: 'Tier 2 (+$15)',
    desc: 'French tips, simple nail art, extra small charms, single cat eye.',
  },
  {
    id: 'tier 3',
    label: 'Tier 3 (+$20)',
    desc: 'Small charms, detailed art on a few fingers, aura/ombre, chrome, stickers.',
  },
  {
    id: 'tier 4',
    label: 'Tier 4 (+$30)',
    desc: '3D gel art (up to 5), medium charms, intricate art, asymmetrical designs, airbrush, foil.',
  },
  {
    id: 'tier 5',
    label: 'Tier 5 (+$40)',
    desc: 'L-XL charms, detailed design on every nail, 3D gel (up to 10), highly complex.',
  },
]

const btnBase =
  'jost p-4 border text-sm transition-all rounded-xl'

const btnSelected =
  'border-[#8BA7C7] bg-[#8BA7C7] text-white'

const btnUnselected =
  'border-[#8BA7C7] bg-[#8BA7C7]/20 text-stone-700 hover:bg-[#8BA7C7]/40'

export default function BookPage() {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null)

  const [serviceTypes, setServiceTypes] =
    useState<ServiceType[]>([])

  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType | null>(null)

  const [services, setServices] =
    useState<Service[]>([])

  const [selectedService, setSelectedService] =
    useState<Service | null>(null)

  const [builderGelServices, setBuilderGelServices] =
    useState<Service[]>([])

  const [isRemovalWithNewSet, setIsRemovalWithNewSet] =
    useState(false)

  const [isFullRemoval, setIsFullRemoval] =
    useState(false)

  const [newSetCategory, setNewSetCategory] =
    useState<Category | null>(null)

  const [newSetServiceTypes, setNewSetServiceTypes] =
    useState<ServiceType[]>([])

  const [newSetServiceType, setNewSetServiceType] =
    useState<ServiceType | null>(null)

  const [newSetServices, setNewSetServices] =
    useState<Service[]>([])

  const [newSetService, setNewSetService] =
    useState<Service | null>(null)

  const [newSetBuilderGelServices, setNewSetBuilderGelServices] =
    useState<Service[]>([])

  const [tier, setTier] = useState('')
  const [inspoImage, setInspoImage] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isBuilderGel =
    selectedCategory?.name === 'Builder Gel'

  const isRemovals =
    selectedCategory?.name === 'Removals'

  const isNewSetBuilderGel =
    newSetCategory?.name === 'Builder Gel'

  // --------------------------------------------------
  // INITIAL DATA
  // --------------------------------------------------

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .then(({ data }) => {
        if (data) {
          setAllCategories(data)
        }
      })

    supabase
      .from('working_hours')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) {
          setWorkingHours(data)
        }
      })

    supabase
      .from('blocked_dates')
      .select('*')
      .then(({ data }) => {
        if (data) {
          setBlockedDates(data)
        }
      })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const rangeStart = new Date(today)
    rangeStart.setDate(today.getDate() + 1)

    const rangeEnd = new Date(today)
    rangeEnd.setDate(today.getDate() + 30)

    const startStr =
      rangeStart.toISOString().split('T')[0]

    const endStr =
      rangeEnd.toISOString().split('T')[0]

    fetch(
      `/api/booked-dates?start=${startStr}&end=${endStr}`
    )
      .then(res => res.json())
      .then(({ dates }) => {
        if (dates) {
          setBookedDates(new Set<string>(dates))
        }
      })
      .catch(error => {
        console.error(
          'Failed to load booked dates:',
          error
        )
      })
  }, [])

  // --------------------------------------------------
  // MAIN CATEGORY
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedCategory) return

    setServiceTypes([])
    setSelectedServiceType(null)
    setServices([])
    setSelectedService(null)
    setBuilderGelServices([])

    supabase
      .from('service_types')
      .select('*')
      .eq('category_id', selectedCategory.id)
      .then(async ({ data: sts }) => {
        if (!sts) return

        setServiceTypes(sts)

        if (isBuilderGel) {
          const allServices: Service[] = []

          for (const st of sts) {
            const { data: svs } = await supabase
              .from('services')
              .select('*')
              .eq('service_type_id', st.id)

            if (svs) {
              allServices.push(...svs)
            }
          }

          setBuilderGelServices(allServices)
        }

        if (isRemovals && sts.length > 0) {
          setSelectedServiceType(sts[0])

          const { data: svs } = await supabase
            .from('services')
            .select('*')
            .eq('service_type_id', sts[0].id)

          if (svs) {
            setServices(svs)
          }
        }
      })
  }, [selectedCategory, isBuilderGel, isRemovals])

  // --------------------------------------------------
  // MAIN SERVICE TYPE
  // --------------------------------------------------

  useEffect(() => {
    if (
      !selectedServiceType ||
      isBuilderGel ||
      isRemovals
    ) {
      return
    }

    setServices([])
    setSelectedService(null)

    supabase
      .from('services')
      .select('*')
      .eq(
        'service_type_id',
        selectedServiceType.id
      )
      .then(({ data }) => {
        if (data) {
          setServices(data)
        }
      })
  }, [
    selectedServiceType,
    isBuilderGel,
    isRemovals,
  ])

  // --------------------------------------------------
  // NEW SET CATEGORY
  // --------------------------------------------------

  useEffect(() => {
    if (!newSetCategory) return

    setNewSetServiceTypes([])
    setNewSetServiceType(null)
    setNewSetServices([])
    setNewSetService(null)
    setNewSetBuilderGelServices([])

    supabase
      .from('service_types')
      .select('*')
      .eq('category_id', newSetCategory.id)
      .then(async ({ data: sts }) => {
        if (!sts) return

        setNewSetServiceTypes(sts)

        if (isNewSetBuilderGel) {
          const allServices: Service[] = []

          for (const st of sts) {
            const { data: svs } = await supabase
              .from('services')
              .select('*')
              .eq('service_type_id', st.id)

            if (svs) {
              allServices.push(...svs)
            }
          }

          setNewSetBuilderGelServices(allServices)
        }
      })
  }, [newSetCategory, isNewSetBuilderGel])

  // --------------------------------------------------
  // NEW SET SERVICE TYPE
  // --------------------------------------------------

  useEffect(() => {
    if (
      !newSetServiceType ||
      isNewSetBuilderGel
    ) {
      return
    }

    setNewSetServices([])
    setNewSetService(null)

    supabase
      .from('services')
      .select('*')
      .eq(
        'service_type_id',
        newSetServiceType.id
      )
      .then(({ data }) => {
        if (data) {
          setNewSetServices(data)
        }
      })
  }, [
    newSetServiceType,
    isNewSetBuilderGel,
  ])

  // --------------------------------------------------
  // AVAILABLE DATES
  // --------------------------------------------------

  const getAvailableDates = () => {
    const dates: {
      dateStr: string
      date: Date
      booked: boolean
      blocked: boolean
    }[] = []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daysToShow = 30

    for (let i = 1; i <= daysToShow; i++) {
      const d = new Date(today)

      d.setDate(today.getDate() + i)

      const dateStr =
        d.toISOString().split('T')[0]

      const hasWorkingHours =
        workingHours.some(
          wh =>
            wh.day_of_week === d.getDay() &&
            wh.is_active
        )

      if (!hasWorkingHours) continue

      const isFullyBlocked =
        blockedDates.some(
          b =>
            b.blocked_date === dateStr &&
            !b.blocked_time
        )

      dates.push({
        dateStr,
        date: d,
        booked: bookedDates.has(dateStr),
        blocked: isFullyBlocked,
      })
    }

    return dates
  }

  // --------------------------------------------------
  // AVAILABLE TIMES
  // --------------------------------------------------

  const getAvailableTimes = async (selectedDate: string) => {
  const hours = workingHours.find(
    wh => wh.day_of_week === new Date(selectedDate + 'T00:00:00').getDay()
  )
  if (!hours) { setAvailableTimes([]); return }

  const res = await fetch(`/api/availability?date=${selectedDate}`)
  const { bookings: existingBookings, blockedRanges, fullDayBlocked, customHours } = await res.json()

  if (fullDayBlocked) { setAvailableTimes([]); return }

  const blockedMins = new Set<number>()

  existingBookings?.forEach((b: { appointment_time: string }) => {
    const [h, m] = b.appointment_time.substring(0, 5).split(':').map(Number)
    const bookingStart = h * 60 + m
    for (let i = 0; i < 210; i += 30) blockedMins.add(bookingStart + i)
  })

  blockedRanges?.forEach((range: { start: string; end: string | null }) => {
    const [startH, startM] = range.start.split(':').map(Number)
    const startMins = startH * 60 + startM
    if (range.end) {
      const [endH, endM] = range.end.split(':').map(Number)
      const endMins = endH * 60 + endM
      for (let m = startMins; m <= endMins; m += 30) blockedMins.add(m)
    } else {
      blockedMins.add(startMins)
    }
  })

  const slots: string[] = []

  // Use custom hours if available, otherwise use standard working hours
  const activeHours = customHours || { start_time: hours.start_time, end_time: hours.end_time }
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

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async () => {
    let serviceId: string | undefined

    if (isFullRemoval) {
      serviceId = selectedService?.id
    } else if (isRemovalWithNewSet) {
      serviceId = newSetService?.id
    } else {
      serviceId = selectedService?.id
    }

    if (
      !serviceId ||
      !date ||
      !time ||
      !clientName.trim() ||
      !clientEmail.trim() ||
      !clientPhone.trim()
    ) {
      return
    }

    // ----------------------------------------------
    // EMAIL VALIDATION
    // ----------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      !emailRegex.test(
        clientEmail.trim()
      )
    ) {
      setEmailError(
        'Please enter a valid email address.'
      )
      return
    }

    // ----------------------------------------------
    // PHONE VALIDATION
    // ----------------------------------------------

    const phoneDigits =
      clientPhone.replace(/\D/g, '')

    if (phoneDigits.length !== 10) {
      setPhoneError(
        'Please enter a valid 10-digit phone number.'
      )
      return
    }

    setEmailError('')
    setPhoneError('')

    if (!isFullRemoval && !tier) {
      return
    }

    setLoading(true)

    // ----------------------------------------------
    // UPLOAD INSPO IMAGE
    // ----------------------------------------------

    let imageUrl = ''

    if (inspoImage) {
      const ext =
        inspoImage.name.split('.').pop()

      const fileName =
        `${Date.now()}.${ext}`

      const { error } =
        await supabase.storage
          .from('inspo-images')
          .upload(
            fileName,
            inspoImage
          )

      if (!error) {
        const { data } =
          supabase.storage
            .from('inspo-images')
            .getPublicUrl(fileName)

        imageUrl =
          data.publicUrl
      }
    }

    // ----------------------------------------------
    // CREATE BOOKING
    // ----------------------------------------------

    try {
      const res = await fetch(
        '/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            tier: isFullRemoval
              ? 'tier 0'
              : tier,
            client_name:
              clientName.trim(),
            client_email:
              clientEmail.trim(),
            client_phone:
              clientPhone.trim(),
            appointment_date: date,
            appointment_time: time,
            inspo_image_url:
              imageUrl,
            notes,
          }),
        }
      )

      if (res.ok) {
        setSubmitted(true)
      } else {
        console.error(
          'Booking failed'
        )
      }
    } catch (error) {
      console.error(
        'Booking error:',
        error
      )
    }

    setLoading(false)
  }

  // --------------------------------------------------
  // FLOW STATE
  // --------------------------------------------------

  const mainServiceDone =
    isBuilderGel
      ? !!selectedService
      : isRemovals
        ? isFullRemoval ||
          isRemovalWithNewSet
        : !!selectedService

  const newSetDone =
    !!newSetService

  const removalNewSetReady =
    isRemovalWithNewSet &&
    newSetDone

  const showTier =
    !isFullRemoval &&
    (
      (!isRemovals &&
        mainServiceDone) ||
      removalNewSetReady
    )

  const showImageNotes =
    isFullRemoval ||
    (showTier && !!tier)

  const showDateTime = showImageNotes

  // --------------------------------------------------
  // SUCCESS
  // --------------------------------------------------

  if (submitted) {
    return (
      <div className="min-h-screen gradient-book flex items-center justify-center">
        <div className="text-center p-8">

          <div className="flex items-center justify-center gap-3 mb-6">
            <Star size={14} />
            <Star size={22} />
            <Star size={14} />
          </div>

          <h1 className="script text-6xl text-stone-900 mb-4">
            you&apos;re booked!
          </h1>

          <p className="jost text-[#8BA7C7]">
            A confirmation email is on its way.
            See you soon!{' '}
            <Star size={14} />
          </p>

        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen gradient-book">

      {/* Navigation */}

      <nav className="flex justify-between items-center px-6 py-4 border-b border-stone-400/50">

        <a
          href="/"
          className="script text-xl text-stone-800 flex-shrink-0"
        >
          bababui nails
        </a>

        <div className="flex gap-4 text-xs tracking-widest">

          <a
            href="/gallery"
            className="jost text-stone-500 hover:text-[#0f3282] transition-colors"
          >
            gallery
          </a>

          <a
            href="/pricing"
            className="jost text-stone-500 hover:text-[#0f3282] transition-colors"
          >
            pricing
          </a>

          <a
            href="/policy"
            className="jost text-stone-500 hover:text-[#0f3282] transition-colors"
          >
            policy
          </a>

          <a
            href="/book"
            className="jost text-[#0f3282] font-medium"
          >
            book
          </a>

        </div>

      </nav>

      <div className="max-w-xl mx-auto px-6 py-16">

        {/* Page Header */}

        <div className="text-center mb-10">

          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={14} />
            <Star size={20} />
            <Star size={14} />
          </div>

          <h1 className="script text-6xl text-stone-900 mb-3">
            book
          </h1>

          <p className="jost text-xs tracking-widest text-[#0f3282] uppercase font-medium">
            appointment
          </p>

        </div>

        {/* ==========================================
            STEP 1 — CATEGORY
        ========================================== */}

        <div className="mb-8">

          <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
            select a service
          </p>

          <div className="grid grid-cols-2 gap-3">

            {allCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat)

                  setIsFullRemoval(false)
                  setIsRemovalWithNewSet(false)

                  setSelectedServiceType(null)
                  setSelectedService(null)

                  setNewSetCategory(null)
                  setNewSetServiceType(null)
                  setNewSetService(null)

                  setTier('')
                  setInspoImage(null)

                  setDate('')
                  setTime('')
                  setAvailableTimes([])

                  setEmailError('')
                  setPhoneError('')
                }}
                className={`${btnBase} ${
                  selectedCategory?.id === cat.id
                    ? btnSelected
                    : btnUnselected
                }`}
              >
                {cat.name}
              </button>
            ))}

          </div>
        </div>

        {/* ==========================================
            ACRYLIC / GEL-X — NEW SET OR FILL
        ========================================== */}

        {selectedCategory &&
          !isBuilderGel &&
          !isRemovals &&
          serviceTypes.length > 0 && (

            <div className="mb-8">

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                new set or fill
              </p>

              <div className="grid grid-cols-2 gap-3">

                {serviceTypes.map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedServiceType(st)
                      setSelectedService(null)
                    }}
                    className={`${btnBase} ${
                      selectedServiceType?.id === st.id
                        ? btnSelected
                        : btnUnselected
                    }`}
                  >
                    {st.name}
                  </button>
                ))}

              </div>

            </div>
          )}

        {/* ==========================================
            ACRYLIC / GEL-X — LENGTH
        ========================================== */}

        {selectedServiceType &&
          !isBuilderGel &&
          !isRemovals &&
          services.length > 0 && (

            <div className="mb-8">

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                length
              </p>

              <div className="grid grid-cols-2 gap-3">

                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() =>
                      setSelectedService(s)
                    }
                    className={`${btnBase} ${
                      selectedService?.id === s.id
                        ? btnSelected
                        : btnUnselected
                    }`}
                  >
                    {s.name}
                  </button>
                ))}

              </div>

            </div>
          )}

        {/* ==========================================
            BUILDER GEL
        ========================================== */}

        {isBuilderGel &&
          builderGelServices.length > 0 && (

            <div className="mb-8">

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                select option
              </p>

              <div className="grid grid-cols-2 gap-3">

                {builderGelServices.map(s => (
                  <button
                    key={s.id}
                    onClick={() =>
                      setSelectedService(s)
                    }
                    className={`${btnBase} ${
                      selectedService?.id === s.id
                        ? btnSelected
                        : btnUnselected
                    }`}
                  >
                    {s.name}
                  </button>
                ))}

              </div>

            </div>
          )}

        {/* ==========================================
            REMOVALS
        ========================================== */}

        {isRemovals &&
          services.length > 0 && (

            <div className="mb-8">

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                select option
              </p>

              <div className="grid grid-cols-2 gap-3">

                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedService(s)

                      if (
                        s.name ===
                        'Full Removal'
                      ) {
                        setIsFullRemoval(true)
                        setIsRemovalWithNewSet(false)
                        setNewSetCategory(null)
                        setNewSetService(null)
                        setTier('')
                        setInspoImage(null)
                      } else {
                        setIsRemovalWithNewSet(true)
                        setIsFullRemoval(false)
                        setNewSetCategory(null)
                        setNewSetService(null)
                      }

                      setDate('')
                      setTime('')
                      setAvailableTimes([])
                    }}
                    className={`${btnBase} ${
                      selectedService?.id === s.id
                        ? btnSelected
                        : btnUnselected
                    }`}
                  >
                    {s.name}
                  </button>
                ))}

              </div>

            </div>
          )}

        {/* ==========================================
            REMOVAL + NEW SET
        ========================================== */}

        {isRemovalWithNewSet && (

          <div className="mb-8 space-y-6">

            <div>

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                select new set service
              </p>

              <div className="grid grid-cols-2 gap-3">

                {allCategories
                  .filter(
                    c => c.name !== 'Removals'
                  )
                  .map(cat => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setNewSetCategory(cat)
                      }
                      className={`${btnBase} ${
                        newSetCategory?.id === cat.id
                          ? btnSelected
                          : btnUnselected
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}

              </div>

            </div>

            {/* New Set Type */}

            {newSetCategory &&
              !isNewSetBuilderGel &&
              newSetServiceTypes.length > 0 && (

                <div>

                  <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                    new set or fill
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    {newSetServiceTypes.map(st => (
                      <button
                        key={st.id}
                        onClick={() =>
                          setNewSetServiceType(st)
                        }
                        className={`${btnBase} ${
                          newSetServiceType?.id === st.id
                            ? btnSelected
                            : btnUnselected
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            {/* New Set Length */}

            {newSetServiceType &&
              !isNewSetBuilderGel &&
              newSetServices.length > 0 && (

                <div>

                  <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                    length
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    {newSetServices.map(s => (
                      <button
                        key={s.id}
                        onClick={() =>
                          setNewSetService(s)
                        }
                        className={`${btnBase} ${
                          newSetService?.id === s.id
                            ? btnSelected
                            : btnUnselected
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}

                  </div>

                </div>
              )}

            {/* New Set Builder Gel */}

            {isNewSetBuilderGel &&
              newSetBuilderGelServices.length > 0 && (

                <div>

                  <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                    select option
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    {newSetBuilderGelServices.map(
                      s => (
                        <button
                          key={s.id}
                          onClick={() =>
                            setNewSetService(s)
                          }
                          className={`${btnBase} ${
                            newSetService?.id === s.id
                              ? btnSelected
                              : btnUnselected
                          }`}
                        >
                          {s.name}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

          </div>
        )}

        {/* ==========================================
            DESIGN TIER
        ========================================== */}

        {showTier && (

          <div className="mb-8">

            <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-2">
              design tier
            </p>

            <p className="jost text-xs text-stone-500 mb-4">
              not sure? check out my{' '}

              <a
                href="https://www.instagram.com/bababui.nails"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[#0f3282]"
              >
                tiers
              </a>{' '}

              on instagram.
            </p>

            <div className="space-y-2">

              {TIERS.map(t => (
                <button
                  key={t.id}
                  onClick={() =>
                    setTier(t.id)
                  }
                  className={`jost w-full p-4 border text-sm transition-all rounded-xl text-left flex gap-4 items-start ${
                    tier === t.id
                      ? btnSelected
                      : btnUnselected
                  }`}
                >

                  <span className="font-medium whitespace-nowrap">
                    {t.label}
                  </span>

                  <span
                    className={`text-xs ${
                      tier === t.id
                        ? 'text-white/70'
                        : 'text-stone-500'
                    }`}
                  >
                    {t.desc}
                  </span>

                </button>
              ))}

            </div>

          </div>
        )}

        {/* ==========================================
            INSPO + NOTES
        ========================================== */}

        {showImageNotes && (

          <div className="mb-8 space-y-6">

            {!isFullRemoval && (

              <div>

                <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                  inspo image (optional)
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    setInspoImage(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                  className="jost w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:border file:border-[#8BA7C7] file:rounded-xl file:text-sm file:bg-[#8BA7C7]/20 file:text-stone-700"
                />

              </div>
            )}

            <div>

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                notes (optional)
              </p>

              <textarea
                value={notes}
                onChange={e =>
                  setNotes(e.target.value)
                }
                placeholder="Any details about your design..."
                className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 resize-none h-24 focus:outline-none focus:border-[#0f3282] rounded-xl"
              />

            </div>

          </div>
        )}

        {/* ==========================================
            DATE & TIME
        ========================================== */}

        {showDateTime && (

          <div className="mb-8 space-y-4">

            <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
              date & time
            </p>

            {(() => {
              const availableDates =
                getAvailableDates()

              const months: Record<
                string,
                typeof availableDates
              > = {}

              availableDates.forEach(d => {
                const month =
                  d.date.toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      year: 'numeric',
                    }
                  ).toUpperCase()

                if (!months[month]) {
                  months[month] = []
                }

                months[month].push(d)
              })

              return Object.entries(
                months
              ).map(
                ([month, dates]) => (

                  <div
                    key={month}
                    className="mb-4"
                  >

                    <p className="jost text-xs text-stone-500 uppercase tracking-widest mb-3">
                      {month}
                    </p>

                    <div className="grid grid-cols-4 gap-2">

                      {dates.map(
                        ({
                          dateStr,
                          date: d,
                          booked,
                          blocked,
                        }) => {

                          // BOTH BOOKED AND FULLY
                          // BLOCKED DATES ARE UNAVAILABLE
                          const unavailable =
                            booked || blocked

                          return (
                            <button
                              key={dateStr}
                              disabled={
                                unavailable
                              }
                              onClick={() => {
                                if (
                                  unavailable
                                ) {
                                  return
                                }

                                setDate(
                                  dateStr
                                )

                                setTime('')

                                setAvailableTimes(
                                  []
                                )

                                getAvailableTimes(
                                  dateStr
                                )
                              }}
                              className={`jost relative overflow-hidden p-3 border transition-all flex flex-col items-center rounded-xl ${
                                unavailable
                                  ? 'border-stone-300 bg-stone-200/60 text-stone-400 cursor-not-allowed opacity-70'
                                  : date ===
                                      dateStr
                                    ? btnSelected
                                    : btnUnselected
                              }`}
                            >

                              {/* =================================
                                  DIAGONAL SLASH
                                  FOR BOOKED / BLOCKED DATES
                              ================================= */}

                              {unavailable && (
                                <span
                                  className="absolute inset-0 pointer-events-none z-20"
                                  style={{
                                    background:
                                      'linear-gradient(135deg, transparent 49%, #6b7280 49.5%, #6b7280 50.5%, transparent 51%)',
                                  }}
                                />
                              )}

                              <span
                                className={`relative z-10 text-xs uppercase ${
                                  unavailable
                                    ? 'text-stone-400'
                                    : date ===
                                        dateStr
                                      ? 'text-white/70'
                                      : 'text-stone-400'
                                }`}
                              >
                                {d.toLocaleDateString(
                                  'en-US',
                                  {
                                    weekday:
                                      'short',
                                  }
                                )}
                              </span>

                              <span
                                className={`relative z-10 text-lg font-light ${
                                  unavailable
                                    ? 'text-stone-500'
                                    : date ===
                                        dateStr
                                      ? 'text-white'
                                      : 'text-stone-700'
                                }`}
                              >
                                {d.getDate()}
                              </span>

                            </button>
                          )
                        }
                      )}

                    </div>

                  </div>
                )
              )
            })()}

            {/* ==========================================
                TIME
            ========================================== */}

            {date &&
              availableTimes.length > 0 && (

                <div>

                  <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-2">
                    time
                  </p>

                  <select
                    value={time}
                    onChange={e =>
                      setTime(
                        e.target.value
                      )
                    }
                    className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl"
                  >

                    <option value="">
                      choose a time slot...
                    </option>

                    {availableTimes.map(
                      t => {
                        const [
                          h,
                          m,
                        ] = t
                          .split(':')
                          .map(Number)

                        const period =
                          h >= 12
                            ? 'PM'
                            : 'AM'

                        const displayH =
                          h === 0
                            ? 12
                            : h > 12
                              ? h - 12
                              : h

                        return (
                          <option
                            key={t}
                            value={t}
                          >
                            {displayH}:
                            {m
                              .toString()
                              .padStart(
                                2,
                                '0'
                              )}{' '}
                            {period}
                          </option>
                        )
                      }
                    )}

                  </select>

                </div>
              )}

            {date &&
              availableTimes.length === 0 && (

                <p className="jost text-sm text-red-400">
                  No available times for this date.
                </p>
              )}

          </div>
        )}

        {/* ==========================================
            CONTACT INFO
        ========================================== */}

        {showDateTime &&
          date &&
          time && (

            <div className="mb-8 space-y-4">

              <p className="jost text-xs text-[#0f3282] uppercase tracking-widest font-medium mb-4">
                your details
              </p>

              {/* Full Name */}

              <div>

                <label className="jost block text-xs text-stone-600 mb-2">
                  full name{' '}
                  <span className="text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="full name"
                  value={clientName}
                  onChange={e =>
                    setClientName(
                      e.target.value
                    )
                  }
                  className="jost w-full border border-[#8BA7C7] bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl"
                />

              </div>

              {/* Email */}

              <div>

                <label className="jost block text-xs text-stone-600 mb-2">
                  email address{' '}
                  <span className="text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="email"
                  placeholder="email address"
                  value={clientEmail}
                  onChange={e => {
                    setClientEmail(
                      e.target.value
                    )
                    setEmailError('')
                  }}
                  onBlur={() => {
                    if (
                      clientEmail.trim()
                    ) {
                      const emailRegex =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                      if (
                        !emailRegex.test(
                          clientEmail.trim()
                        )
                      ) {
                        setEmailError(
                          'Please enter a valid email address.'
                        )
                      }
                    }
                  }}
                  className={`jost w-full border ${
                    emailError
                      ? 'border-red-400'
                      : 'border-[#8BA7C7]'
                  } bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl`}
                />

                {emailError && (
                  <p className="jost text-xs text-red-400 mt-2">
                    {emailError}
                  </p>
                )}

              </div>

              {/* Phone */}

              <div>

                <label className="jost block text-xs text-stone-600 mb-2">
                  phone number{' '}
                  <span className="text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="tel"
                  placeholder="phone number"
                  value={clientPhone}
                  onChange={e => {
                    setClientPhone(
                      e.target.value
                    )
                    setPhoneError('')
                  }}
                  onBlur={() => {
                    if (
                      clientPhone.trim()
                    ) {
                      const phoneDigits =
                        clientPhone.replace(
                          /\D/g,
                          ''
                        )

                      if (
                        phoneDigits.length !==
                        10
                      ) {
                        setPhoneError(
                          'Please enter a valid 10-digit phone number.'
                        )
                      }
                    }
                  }}
                  className={`jost w-full border ${
                    phoneError
                      ? 'border-red-400'
                      : 'border-[#8BA7C7]'
                  } bg-white/50 p-3 text-sm text-stone-700 focus:outline-none focus:border-[#0f3282] rounded-xl`}
                />

                {phoneError && (
                  <p className="jost text-xs text-red-400 mt-2">
                    {phoneError}
                  </p>
                )}

              </div>

              {/* Submit */}

              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !clientName.trim() ||
                  !clientEmail.trim() ||
                  !clientPhone.trim() ||
                  !!emailError ||
                  !!phoneError
                }
                className="jost w-full py-3 bg-[#6A97C4] text-white text-xs tracking-widest uppercase disabled:opacity-40 hover:bg-[#8BA7C7] transition-colors rounded-xl"
              >
                {loading
                  ? 'booking...'
                  : 'book appointment'}
              </button>

            </div>
          )}

      </div>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="py-12 px-8 text-center border-t border-stone-400/50">

        <div className="flex items-center justify-center gap-3 mb-4">
          <Star size={10} />
          <Star size={16} />
          <Star size={10} />
        </div>

        <p className="jost text-xs text-stone-500 tracking-widest">
          © 2026 bababui nails · calgary, ab
        </p>

      </footer>

    </div>
  )
}
