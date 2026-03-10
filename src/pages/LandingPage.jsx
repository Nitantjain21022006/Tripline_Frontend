import { useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Star } from 'lucide-react'
import HeroSearchCard from '../components/HeroSearchCard'
import OffersCarousel from '../components/OffersCarousel'
import PopularRoutes from '../components/PopularRoutes'
import WhyTripline from '../components/WhyTripline'
import CarrierCarousel from '../components/CarrierCarousel'
import TravelStories from '../components/TravelStories'
import FooterLarge from '../components/FooterLarge'

const STATS = [
    { value: '500+', label: 'Routes', emoji: '🗺️' },
    { value: '50+', label: 'Cities', emoji: '🏙️' },
    { value: '3', label: 'Modes', emoji: '🚀' },
    { value: '₹200Cr+', label: 'Saved', emoji: '💸' },
]

const TRUST_BADGES = [
    { label: '4.8★ App Rating', sub: '50K+ Reviews' },
    { label: 'Stripe Secured', sub: '100% Safe Payments' },
    { label: '#1 Multi-Modal', sub: 'India\'s First Platform' },
]

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="pt-16 overflow-x-hidden">

            {/* ═══════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════ */}
            <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">

                {/* Background blobs */}
                <div className="absolute top-16 left-0 w-[40rem] h-[40rem] bg-primary-600/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none translate-x-1/3" />
                <div className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] bg-sky-600/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 max-w-5xl mx-auto animate-slide-up w-full">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 text-primary-400 text-xs font-semibold px-4 py-2 rounded-full mb-7">
                        <Zap className="w-3.5 h-3.5" />
                        India's First Multi-Modal Travel Platform
                        <span className="ml-1 bg-primary-500/20 text-primary-300 text-[10px] px-1.5 py-0.5 rounded-full">NEW</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-5">
                        Travel Smarter.
                        <br />
                        <span className="bg-gradient-to-r from-primary-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
                            Go Further.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
                        Combine flights, trains, and buses into one seamless multi-modal journey.
                        Find the best route — optimized by price, time, or balance.
                    </p>

                    {/* Trust badges row */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        {TRUST_BADGES.map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white/80 dark:bg-dark-700/60 border border-gray-200 dark:border-white/5 px-3 py-1.5 rounded-full text-xs shadow-sm">
                                <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                <span className="text-gray-800 dark:text-white font-semibold">{t.label}</span>
                                <span className="text-gray-400 md:text-gray-500">·</span>
                                <span className="text-gray-500 dark:text-gray-400">{t.sub}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── MAIN SEARCH CARD ── */}
                    <div className="text-left">
                        <HeroSearchCard />
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4 mt-10 max-w-lg mx-auto">
                        {STATS.map(s => (
                            <div key={s.label} className="text-center">
                                <div className="text-lg mb-0.5">{s.emoji}</div>
                                <div className="text-xl font-black text-gray-900 dark:text-white">{s.value}</div>
                                <div className="text-[11px] text-gray-600 dark:text-gray-500 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce-subtle">
                    <div className="w-px h-8 bg-gradient-to-b from-transparent to-gray-600" />
                    <div className="text-[10px] text-gray-600 tracking-widest uppercase">Scroll</div>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/*  OFFERS CAROUSEL                        */}
            {/* ═══════════════════════════════════════ */}
            <OffersCarousel />

            {/* ═══════════════════════════════════════ */}
            {/*  WHY TRIPLINE                           */}
            {/* ═══════════════════════════════════════ */}
            <WhyTripline />

            {/* ═══════════════════════════════════════ */}
            {/*  POPULAR ROUTES                         */}
            {/* ═══════════════════════════════════════ */}
            <PopularRoutes />

            {/* ═══════════════════════════════════════ */}
            {/*  CARRIERS                               */}
            {/* ═══════════════════════════════════════ */}
            <CarrierCarousel />

            {/* ═══════════════════════════════════════ */}
            {/*  TRAVEL STORIES                         */}
            {/* ═══════════════════════════════════════ */}
            <TravelStories />

            {/* ═══════════════════════════════════════ */}
            {/*  CTA BANNER                             */}
            {/* ═══════════════════════════════════════ */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="glass-card p-10 text-center relative overflow-hidden">
                        {/* Gradient accent */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-purple-600/10 pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Ready to travel smarter?</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-7 max-w-lg mx-auto text-sm leading-relaxed">
                                Join thousands of travellers who plan multi-modal journeys with Tripline. Sign up free and get ₹500 off your first booking.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button onClick={() => navigate('/register')} className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2 group">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <button onClick={() => navigate('/search')} className="btn-outline flex items-center justify-center gap-2">
                                    Explore Routes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/*  FOOTER                                 */}
            {/* ═══════════════════════════════════════ */}
            <FooterLarge />
        </div>
    )
}
