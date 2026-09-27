'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-stone-200 flex flex-col py-8 px-4">
        <p className="text-xs tracking-widest text-stone-400 uppercase mb-8 px-2">bababui nails</p>
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/admin"
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === '/admin'
                ? 'bg-stone-800 text-white'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
            }`}
          >
            Bookings
          </Link>
          <Link
            href="/admin/availability"
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === '/admin/availability'
                ? 'bg-stone-800 text-white'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
            }`}
          >
            Availability
          </Link>

          <Link
            href="/admin/gallery"
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === '/admin/gallery'
                ? 'bg-stone-800 text-white'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
            }`}
            >
            Gallery
            </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="text-sm text-stone-400 hover:text-stone-600 px-3 py-2 text-left"
        >
          Log out
        </button>
      </div>
      

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}