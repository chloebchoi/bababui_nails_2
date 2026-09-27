'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

const Star = ({ size = 16 }: { size?: number }) => (
  <img
    src="/star.png"
    alt="star"
    width={size}
    height={size}
    style={{
      filter: 'invert(60%) sepia(30%) saturate(500%) hue-rotate(180deg) brightness(90%)',
      display: 'inline-block'
    }}
  />
)

export default function GalleryPage() {
  const [images, setImages] = useState<{ name: string; url: string }[]>([])

  useEffect(() => {
    supabase.storage.from('gallery-images').list('', {
      sortBy: { column: 'created_at', order: 'desc' }
    }).then(({ data }) => {
      if (data) {
        setImages(data.map(file => ({
          name: file.name,
          url: supabase.storage.from('gallery-images').getPublicUrl(file.name).data.publicUrl
        })))
      }
    })
  }, [])

  return (
    <div className="min-h-screen gradient-gallery">

      {/* Nav */}
       <nav className="flex justify-between items-center px-6 py-4 border-b border-stone-400/50">
        <Link href="/" className="script text-xl text-stone-800 flex-shrink-0">bababui nails</Link>
        <div className="flex gap-4 text-xs tracking-widest">
          <Link href="/gallery" className="jost text-[#0f3282] font-medium">gallery</Link>
          <Link href="/pricing" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">pricing</Link>
          <Link href="/policy" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">policy</Link>
          <Link href="/book" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">book</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={14} />
            <Star size={20} />
            <Star size={14} />
          </div>
          <h1 className="script text-6xl text-stone-900 mb-3">gallery</h1>
  
        </div>

        {images.length === 0 && (
          <p className="jost text-center text-stone-400 text-sm">No photos yet.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.name} className="overflow-hidden rounded-xl">
              <Image
                src={img.url}
                alt="Nail art"
                width={400}
                height={400}
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <footer className="py-12 px-8 text-center border-t border-stone-400/50">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star size={10} />
          <Star size={16} />
          <Star size={10} />
        </div>
        <p className="jost text-xs text-stone-700 tracking-widest">© 2026 bababui nails · calgary, ab</p>
      </footer>

    </div>
  )
}