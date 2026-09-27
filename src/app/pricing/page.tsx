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

export default function PricingPage() {
  return (
    <div className="min-h-screen gradient-pricing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Jost:wght@300;400;500&display=swap');
      `}</style>

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-stone-400/50">
        <Link href="/" className="script text-xl text-stone-800 flex-shrink-0">
          bababui nails
        </Link>

        <div className="flex gap-4 text-xs tracking-widest">
          <Link href="/gallery" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">
            gallery
          </Link>
          <Link href="/pricing" className="jost text-[#0f3282] font-medium">
            pricing
          </Link>
          <Link href="/policy" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">
            policy
          </Link>
          <Link href="/book" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">
            book
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={14} />
            <Star size={20} />
            <Star size={14} />
          </div>

          <h1 className="script text-6xl text-stone-900 mb-3">
            pricing
          </h1>

          <p className="jost text-stone-500 text-sm mb-8">
            base price + design tier &mdash;{' '}
            <a
              href="https://www.instagram.com/bababui.nails"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-[#0f3282]"
            >
              dm for a free consultation
            </a>
          </p>

          <div className="border-t border-stone-400/50" />
        </div>

        {/* Pricing sections */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-0 items-start mb-0 pt-8">

          {/* LEFT COLUMN */}
          <div className="space-y-12 md:pr-12">

            {/* Acrylic */}
            <div>
              <p className="script text-3xl text-stone-700 mb-5">
                acrylic
              </p>

              <div className="grid grid-cols-2 gap-x-8 mb-3">
                <span className="jost text-[#0f3282] text-xs tracking-widest uppercase font-medium">
                  new set
                </span>
                <span className="jost text-[#0f3282] text-xs tracking-widest uppercase font-medium">
                  fill
                </span>
              </div>

              {[
                { length: 'short', new: '$45', fill: '$40' },
                { length: 'medium', new: '$50', fill: '$45' },
                { length: 'long', new: '$55', fill: '$50' },
                { length: 'extra long', new: '$60', fill: '$55' },
              ].map(row => (
                <div
                  key={row.length}
                  className="grid grid-cols-2 gap-x-8 py-2 border-b border-stone-400/30"
                >
                  <div className="flex justify-between pr-4">
                    <span className="jost text-stone-900">{row.length}</span>
                    <span className="jost text-stone-700">{row.new}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="jost text-stone-900">{row.length}</span>
                    <span className="jost text-stone-700">{row.fill}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Gel-X */}
            <div>
              <p className="script text-3xl text-stone-700 mb-5">
                gel-x
              </p>

              <div className="grid grid-cols-2 gap-x-8 mb-3">
                <span className="jost text-[#0f3282] text-xs tracking-widest uppercase font-medium">
                  new set
                </span>
                <span className="jost text-[#0f3282] text-xs tracking-widest uppercase font-medium">
                  fill
                </span>
              </div>

              {[
                { length: 'short', new: '$40', fill: '$35' },
                { length: 'medium', new: '$45', fill: '$40' },
                { length: 'long', new: '$50', fill: '$45' },
                { length: 'extra long', new: '$55', fill: '$50' },
              ].map(row => (
                <div
                  key={row.length}
                  className="grid grid-cols-2 gap-x-8 py-2 border-b border-stone-400/30"
                >
                  <div className="flex justify-between pr-4">
                    <span className="jost text-stone-900">{row.length}</span>
                    <span className="jost text-stone-700">{row.new}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="jost text-stone-900">{row.length}</span>
                    <span className="jost text-stone-700">{row.fill}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Builder Gel — mobile only position */}
            <div className="md:hidden">
              <p className="script text-3xl text-stone-700 mb-5">
                builder gel
              </p>

              {[
                { name: 'natural nail overlay', price: '$35' },
                { name: 'fill — natural nail overlay', price: '$30' },
              ].map(item => (
                <div
                  key={item.name}
                  className="flex justify-between py-2 border-b border-stone-400/30"
                >
                  <span className="jost text-stone-900">
                    {item.name}
                  </span>

                  <span className="jost text-stone-700">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block bg-stone-400/50 mx-8 self-stretch" />

          {/* RIGHT: Design Tiers */}
          <div className="md:pl-12 mt-12 md:mt-0">

            <p className="script text-3xl text-stone-700 mb-2">
              design tiers
            </p>

            <p className="jost text-stone-500 text-sm mb-6">
              added onto base price. dm to confirm your tier.
            </p>

            <div className="space-y-3">
              {[
                {
                  tier: 'Tier 0',
                  price: '+$0',
                  desc: 'one solid color, no nail art.'
                },
                {
                  tier: 'Tier 1',
                  price: '+$10',
                  desc: '1-2 solid colors, nail art on up to 2 fingers, initials.'
                },
                {
                  tier: 'Tier 2',
                  price: '+$15',
                  desc: 'french tips on all fingers, simple nail art, extra small charms, single cat eye color.'
                },
                {
                  tier: 'Tier 3',
                  price: '+$20',
                  desc: 'small charms, detailed art on a few fingers, aura/ombre, chrome, cat eye, stickers.'
                },
                {
                  tier: 'Tier 4',
                  price: '+$30',
                  desc: '3D gel art (up to 5), medium charms, intricate art, asymmetrical designs, isolated chrome/aura/ombre, airbrush, foil.'
                },
                {
                  tier: 'Tier 5',
                  price: '+$40',
                  desc: 'L-XL charms, detailed design on every nail, 3D gel (up to 10), highly complex, lots of layering.'
                },
              ].map(item => (
                <div
                  key={item.tier}
                  className="flex gap-4 py-2 border-b border-stone-400/30"
                >
                  <div className="w-20 flex-shrink-0">
                    <p className="jost text-stone-900">
                      {item.tier}
                    </p>
                    <p className="jost text-stone-500">
                      {item.price}
                    </p>
                  </div>

                  <p className="jost text-stone-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Desktop-only bottom section */}
        <div className="hidden md:block pt-0">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-0 items-start">

            {/* Builder Gel */}
            <div className="md:pr-12 pb-12 md:pb-0">

              <p className="script text-3xl text-stone-700 mb-5">
                builder gel
              </p>

              {[
                { name: 'natural nail overlay', price: '$35' },
                { name: 'fill — natural nail overlay', price: '$30' },
              ].map(item => (
                <div
                  key={item.name}
                  className="flex justify-between py-2 border-b border-stone-400/30"
                >
                  <span className="jost text-stone-900">
                    {item.name}
                  </span>

                  <span className="jost text-stone-700">
                    {item.price}
                  </span>
                </div>
              ))}

            </div>

            <div className="hidden md:block bg-stone-400/50 mx-8 self-stretch" />

            {/* Removals */}
            <div className="md:pl-12">

              <p className="script text-3xl text-stone-700 mb-5">
                removals
              </p>

              {[
                {
                  name: 'full removal (acrylic, gel-x, builder gel)',
                  price: '$15'
                },
                {
                  name: 'removal with new set (acrylic, gel-x, builder gel)',
                  price: '$10'
                },
              ].map(item => (
                <div
                  key={item.name}
                  className="flex justify-between py-2 border-b border-stone-400/30"
                >
                  <span className="jost text-stone-900">
                    {item.name}
                  </span>

                  <span className="jost text-stone-700">
                    {item.price}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* Mobile removals */}
        <div className="md:hidden mt-12">

          <p className="script text-3xl text-stone-700 mb-5">
            removals
          </p>

          {[
            {
              name: 'full removal (acrylic, gel-x, builder gel)',
              price: '$15'
            },
            {
              name: 'removal with new set (acrylic, gel-x, builder gel)',
              price: '$10'
            },
          ].map(item => (
            <div
              key={item.name}
              className="flex justify-between py-2 border-b border-stone-400/30"
            >
              <span className="jost text-stone-900">
                {item.name}
              </span>

              <span className="jost text-stone-700">
                {item.price}
              </span>
            </div>
          ))}

        </div>

        <div className="text-center mt-16">
          <Link
            href="/book"
            className="jost inline-block bg-stone-900 text-white text-xs px-12 py-4 tracking-widest uppercase hover:bg-white/20 transition-colors"
          >
            book now
          </Link>
        </div>

      </div>

      <footer className="py-12 px-8 text-center border-t border-stone-400/50 mt-8">

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
