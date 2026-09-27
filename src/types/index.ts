export type Category = {
  id: string
  name: string
}

export type ServiceType = {
  id: string
  category_id: string
  name: string
}

export type Service = {
  id: string
  service_type_id: string
  name: string
}

export type Booking = {
  id: string
  service_id: string
  tier?: string | null
  client_name: string
  client_email: string
  client_phone: string
  appointment_date: string
  appointment_time: string
  inspo_image_url: string
  final_price?: number
  quote_sent: boolean
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
}

export type WorkingHours = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export type BlockedDate = {
  id: string
  blocked_date: string
  blocked_time: string | null
  reason: string | null
}

export type CustomHours = {
  id: string
  date: string
  start_time: string
  end_time: string
}