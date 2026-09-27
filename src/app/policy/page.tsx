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

export default function PolicyPage() {
  return (
    <div className="min-h-screen gradient-policy">

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-stone-400/50">
        <Link href="/" className="script text-xl text-stone-800 flex-shrink-0">bababui nails</Link>
        <div className="flex gap-4 text-xs tracking-widest">
          <Link href="/gallery" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">gallery</Link>
          <Link href="/pricing" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">pricing</Link>
          <Link href="/policy" className="jost text-[#0f3282] font-medium">policy</Link>
          <Link href="/book" className="jost text-stone-500 hover:text-[#0f3282] transition-colors">book</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={14} />
            <Star size={20} />
            <Star size={14} />
          </div>
          <h1 className="script text-6xl text-stone-900 mb-3">policy</h1>
         
        </div>

        <div className="space-y-8">

          <div className="border-b border-stone-400/30 pb-8">
            <h2 className="script text-2xl text-stone-800 mb-3">Arrival</h2>
            <p className="jost text-stone-700 leading-relaxed">Location details will be provided via email after booking. Please text me when you arrive and wait at the back door.</p>
          </div>

          <div className="border-b border-stone-400/30 pb-8">
            <h2 className="script text-2xl text-stone-800 mb-3">Payment</h2>
            <p className="jost text-stone-700 leading-relaxed">I accept cash and e-transfer. Card payments will require a 2.5% markup.</p>
          </div>

          <div className="border-b border-stone-400/30 pb-8">
            <h2 className="script text-2xl text-stone-800 mb-3">Cancellations & Late Arrivals</h2>
            <p className="jost text-stone-700 leading-relaxed">No deposit required. However, if you arrive 30 minutes after your appointment it will be cancelled. Please inform me at least 24 hours in advance to cancel or reschedule. I will send you a confirmation text closer to your appointment date.</p>
          </div>

          <div className="border-b border-stone-400/30 pb-8">
            <h2 className="script text-2xl text-stone-800 mb-3">Nail Condition</h2>
            <p className="jost text-stone-700 leading-relaxed">I do not work on extremely damaged or infected nails. I do not offer foreign fills, please book a full removal and new set.</p>
          </div>

          <div className="border-b border-stone-400/30 pb-8">
            <h2 className="script text-2xl text-stone-800 mb-3">Important Notes</h2>
            <ul className="jost text-stone-700 leading-relaxed space-y-2">
              <li>Appointment length can be 2–4+ hours depending on the service.</li>
              <li>Washroom available at any time during the appointment.</li>
              <li>Free snacks and drinks provided!</li>
            </ul>
          </div>

          <div>
            <h2 className="script text-2xl text-stone-800 mb-3">Contact</h2>
            <p className="jost text-stone-700 leading-relaxed">For questions, DM on Instagram <a href="https://www.instagram.com/bababui.nails" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[#0f3282]">@bababui.nails</a></p>
          </div>

        </div>
      </div>

      <footer className="py-12 px-8 text-center border-t border-stone-400/50 mt-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star size={10} />
          <Star size={16} />
          <Star size={10} />
        </div>
        <p className="jost text-xs text-stone-500 tracking-widest">© 2026 bababui nails · calgary, ab</p>
      </footer>

    </div>
  )
}