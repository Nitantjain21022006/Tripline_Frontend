import { useState, useRef } from 'react'
import { Tag, ChevronLeft, ChevronRight, Plane, Train, Bus, Zap } from 'lucide-react'

const OFFERS = [
    {
        id: 1,
        badge: 'LIMITED',
        title: 'Flash Sale: Flights up to 30% Off',
        desc: 'Book any flight before midnight tonight. Use code FLASH30',
        code: 'FLASH30',
        gradient: 'from-sky-600 to-blue-800',
        icon: Plane,
        expiry: 'Ends Tonight',
    },
    {
        id: 2,
        badge: 'NEW USER',
        title: '₹500 off your first booking',
        desc: 'Welcome aboard! Get ₹500 off on any trip above ₹1,500.',
        code: 'FIRST500',
        gradient: 'from-emerald-600 to-teal-800',
        icon: Zap,
        expiry: 'For new users only',
    },
    {
        id: 3,
        badge: 'WEEKEND',
        title: 'Train travel at flat ₹199',
        desc: 'All sleeper class train bookings this weekend for just ₹199.',
        code: 'WEEKEND199',
        gradient: 'from-amber-500 to-orange-700',
        icon: Train,
        expiry: 'Sat & Sun only',
    },
    {
        id: 4,
        badge: 'COMBO',
        title: 'Multi-modal combo: Save 15%',
        desc: 'Book a Flight + Bus combo journey and save 15% on total fare.',
        code: 'COMBO15',
        gradient: 'from-purple-600 to-violet-800',
        icon: Bus,
        expiry: 'Valid this month',
    },
]

export default function OffersCarousel() {
    const [copied, setCopied] = useState(null)
    const scrollRef = useRef(null)

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
        }
    }

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(code)
            setTimeout(() => setCopied(null), 2000)
        })
    }

    return (
        <section className="py-4 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary-400" />
                            Offers For You
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Exclusive deals just for Tripline users</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll(-1)} className="w-9 h-9 bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center hover:bg-dark-600 hover:border-white/20 transition-all hover:scale-105 active:scale-95">
                            <ChevronLeft className="w-4 h-4 text-gray-300" />
                        </button>
                        <button onClick={() => scroll(1)} className="w-9 h-9 bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center hover:bg-dark-600 hover:border-white/20 transition-all hover:scale-105 active:scale-95">
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
                    {OFFERS.map(offer => {
                        const Icon = offer.icon
                        return (
                            <div
                                key={offer.id}
                                className={`flex-shrink-0 w-72 sm:w-80 snap-start rounded-2xl bg-gradient-to-br ${offer.gradient} p-5 sm:p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.03] hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-${offer.gradient.split('-')[2]}-500/30 transition-all duration-300`}
                            >
                                {/* Background accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-[10px] font-black tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/20">
                                            {offer.badge}
                                        </span>
                                        <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-white font-bold text-base leading-snug mb-1">{offer.title}</h3>
                                    <p className="text-white/70 text-xs leading-relaxed mb-4">{offer.desc}</p>

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyCode(offer.code); }}
                                            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-mono text-sm font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                                        >
                                            {copied === offer.code ? '✓ Copied!' : offer.code}
                                        </button>
                                        <span className="text-[11px] text-white/50">{offer.expiry}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
