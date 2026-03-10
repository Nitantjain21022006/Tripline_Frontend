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
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                        {TRUST_BADGES.map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white/80 dark:bg-dark-700/80 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full text-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                <span className="text-gray-900 dark:text-white font-bold tracking-tight">{t.label}</span>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <span className="text-gray-500 dark:text-gray-400 font-medium">{t.sub}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── MAIN SEARCH CARD ── */}
                    <div className="text-left relative z-20 hover:shadow-2xl hover:shadow-primary-500/10 transition-shadow duration-500 rounded-3xl group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <HeroSearchCard />
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4 mt-10 max-w-lg mx-auto">
                        {STATS.map(s => (
                            <div key={s.label} className="text-center group p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-dark-800/40 transition-colors">
                                <div className="text-2xl mb-1.5 group-hover:-translate-y-1 transition-transform">{s.emoji}</div>
                                <div className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</div>
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
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
            <div className="py-20 md:py-28 relative">
                <OffersCarousel />
            </div>

            {/* ═══════════════════════════════════════ */}
            {/*  WHY TRIPLINE                           */}
            {/* ═══════════════════════════════════════ */}
            <div className="py-16 bg-white/40 dark:bg-dark-900/40 border-y border-gray-200/50 dark:border-white/5">
                <WhyTripline />
            </div>

            {/* ═══════════════════════════════════════ */}
            {/*  POPULAR ROUTES                         */}
            {/* ═══════════════════════════════════════ */}
            <div className="py-20 md:py-28">
                <PopularRoutes />
            </div>

            {/* ═══════════════════════════════════════ */}
            {/*  CARRIERS                               */}
            {/* ═══════════════════════════════════════ */}
            <div className="pt-10 pb-20 md:pb-28">
                <CarrierCarousel />
            </div>

            {/* ═══════════════════════════════════════ */}
            {/*  TRAVEL STORIES                         */}
            {/* ═══════════════════════════════════════ */}
            <div className="py-20 md:py-28 bg-white/40 dark:bg-dark-900/40 border-y border-gray-200/50 dark:border-white/5">
                <TravelStories />
            </div>

            {/* ═══════════════════════════════════════ */}
            {/*  CTA BANNER                             */}
            {/* ═══════════════════════════════════════ */}
            <section className="py-24 px-4 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden shadow-2xl hover:shadow-primary-500/10 transition-shadow duration-500 group">
                        {/* Gradient accent */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-purple-600/10 pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity duration-700" />

                        <div className="relative z-10 animate-slide-up">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Ready to travel <span className="text-primary-500">smarter?</span></h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto text-base leading-relaxed">
                                Join thousands of travellers who plan multi-modal journeys with Tripline. Sign up free and get ₹500 off your first booking.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => navigate('/register')} className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 group/btn hover:-translate-y-0.5 shadow-xl shadow-primary-500/20">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => navigate('/search')} className="btn-outline flex items-center justify-center gap-2 hover:-translate-y-0.5 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm">
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
