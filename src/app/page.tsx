'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

const Divider = () => (
  <div className="flex items-center justify-center gap-4 py-8 px-8">
    <div className="flex-1 h-px bg-stone-400 max-w-sm ml-auto" />
    <Star size={14} />
    <div className="flex-1 h-px bg-stone-400 max-w-sm mr-auto" />
  </div>
)

export default function HomePage() {
  const beholdRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (beholdRef.current) {
      beholdRef.current.innerHTML = '<behold-widget feed-id="YN0mLbd8yYoejZzdt7N2"></behold-widget>'
    }
    const s = document.createElement('script')
    s.type = 'module'
    s.src = 'https://w.behold.so/widget.js'
    document.head.appendChild(s)
  }, [])

  return (
    <div className="min-h-screen gradient-home">

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-stone-400/50">
        <Link href="/" className="script text-xl text-stone-800 flex-shrink-0">bababui nails</Link>
        <div className="flex gap-4 text-xs tracking-widest">
          <Link href="/gallery" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">gallery</Link>
          <Link href="/pricing" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">pricing</Link>
          <Link href="/policy" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">policy</Link>
          <Link href="/book" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">book</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-6 pt-8 pb-4">
        <section className="rounded-2xl px-8 py-20 max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={14} />
            <Star size={22} />
            <Star size={14} />
          </div>
          <p className="jost text-xs tracking-widest text-[#0f3282] uppercase mb-4 font-medium">nail artist · calgary, ab</p>
          <h1 className="script text-8xl text-stone-900 mb-4 leading-none">bababui nails</h1>
          <div className="flex items-center justify-center mb-6">
            <Star size={20} />
          </div>
          <p className="jost text-stone-700 font-light mb-12 max-w-sm mx-auto text-sm tracking-wide">custom nail art crafted with care</p>
          <Link
            href="/book"
            className="jost inline-block bg-stone-900 text-white text-xs px-12 py-4 tracking-widest uppercase hover:bg-white/20 transition-colors"
          >
            book now
          </Link>
        </section>
      </div>

      <Divider />

      {/* Meet your artist */}
      <div className="px-6 py-4">
        <section className="rounded-2xl max-w-4xl mx-auto p-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-52 h-52 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#8BA7C7]">
              <Image
                src="https://hfbfkxmlrotzucczwsvm.supabase.co/storage/v1/object/public/profile/profile.PNG"
                alt="Brooklyne"
                width={208}
                height={208}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="jost text-xs tracking-widest text-[#0f3282] uppercase mb-3 font-medium">meet your artist</p>
              <h2 className="script text-5xl text-stone-800 mb-4">
                Hi, I&apos;m Brooklyne{' '}
                <img src="/star.png" alt="star" width={28} height={28} style={{display:'inline', verticalAlign:'middle', marginBottom:'6px'}} />
              </h2>
              <p className="jost text-stone-600 font-light leading-relaxed text-base">
  Based in Calgary, AB · I&apos;m a home-based nail artist specializing in custom nail art. From clean minimalist sets to detailed 3D designs, every set is made with care and created just for you. 
</p>
            </div>
          </div>
        </section>
      </div>

      <Divider />

      {/* Hours + Contact */}
      <div className="px-6 py-4">
        <section className="max-w-4xl mx-auto px-12 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="jost text-xs tracking-widest text-[#0f3282] uppercase mb-6 font-medium">hours</p>
              <div className="space-y-4">
                <div className="flex justify-between text-sm border-b border-stone-400/50 pb-3">
                <span className="jost text-stone-900">friday, saturday, sunday</span>
                <span className="jost text-stone-700">10:00 am – 7:00 pm</span>
              </div>
              <div className="flex justify-between text-sm border-b border-stone-400/50 pb-3">
                <span className="jost text-stone-900">monday, wednesday</span>
                <span className="jost text-stone-700">4:30 pm – 7:00 pm</span>
              </div>
              <div className="flex justify-between text-sm border-b border-stone-400/50 pb-3">
                <span className="jost text-stone-900">tuesday, thursday</span>
                <span className="jost text-stone-700">1:30 pm – 7:00 pm</span>
              </div>
                <p className="jost text-xs text-stone-700">schedule may vary — check instagram for updates.</p>
              </div>
            </div>
            <div>
              <p className="jost text-xs tracking-widest text-[#0f3282] uppercase mb-6 font-medium">contact</p>
              <div className="space-y-4">
                <a href="https://www.instagram.com/bababui.nails" target="_blank" rel="noopener noreferrer" className="flex justify-between text-sm border-b border-stone-400/50 pb-3 hover:text-[#0f3282] transition-colors">
                  <span className="jost text-stone-900">instagram</span>
                  <span className="jost text-stone-700">@bababui.nails</span>
                </a>
                <a href="https://www.tiktok.com/@bababui.nails" target="_blank" rel="noopener noreferrer" className="flex justify-between text-sm border-b border-stone-400/50 pb-3 hover:text-[#0f3282] transition-colors">
                  <span className="jost text-stone-900">tiktok</span>
                  <span className="jost text-stone-700">@bababui.nails</span>
                </a>
                <a href="mailto:bababuinails@gmail.com" className="flex justify-between text-sm border-b border-stone-400/50 pb-3 hover:text-[#0f3282] transition-colors">
                  <span className="jost text-stone-900">email</span>
                  <span className="jost text-stone-700">bababuinails@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Divider />

      {/* Gallery preview */}
      <div className="px-6 py-4">
        <section className="rounded-2xl max-w-4xl mx-auto p-12 text-center">
          <p className="jost text-xs tracking-widest text-[#0f3282] uppercase mb-8 font-medium">gallery</p>
          <div ref={beholdRef} />
          <div className="mt-8">
            <Link href="/gallery" className="jost text-xs text-stone-700 hover:text-[#0f3282] transition-colors tracking-widest uppercase underline underline-offset-4">
              view full gallery
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
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