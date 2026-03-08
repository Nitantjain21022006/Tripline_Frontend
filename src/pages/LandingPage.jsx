import { useNavigate } from 'react-router-dom'
import { Plane, Train, Bus, Zap, Shield, Clock, ChevronRight, Globe, Map } from 'lucide-react'
import SearchBar from '../components/SearchBar'

const stats = [
    { value: '500+', label: 'Routes' },
    { value: '50+', label: 'Cities' },
    { value: '3', label: 'Transport Modes' },
    { value: '24/7', label: 'Support' },
]

const features = [
    {
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        title: 'Intelligent Routing',
        desc: 'Our AI engine finds the best combination of flights, trains, and buses for your journey.',
        color: 'yellow',
    },
    {
        icon: <Globe className="w-6 h-6 text-sky-400" />,
        title: 'Multi-Modal Travel',
        desc: 'Seamlessly combine Bus, Train and Flight on a single booking with one ticket.',
        color: 'sky',
    },
    {
        icon: <Shield className="w-6 h-6 text-emerald-400" />,
        title: 'Secure Payments',
        desc: 'Bank-grade encrypted payments via Stripe. Your money and data are safe with us.',
        color: 'emerald',
    },
    {
        icon: <Clock className="w-6 h-6 text-purple-400" />,
        title: 'Optimized for You',
        desc: 'Filter by cheapest, fastest, or most balanced route. Travel your way.',
        color: 'purple',
    },
]

const popularRoutes = [
    { from: 'Ahmedabad', to: 'Mumbai', modes: ['BUS', 'TRAIN'], price: '₹800' },
    { from: 'Delhi', to: 'Srinagar', modes: ['TRAIN', 'FLIGHT'], price: '₹3,200' },
    { from: 'Mumbai', to: 'Delhi', modes: ['FLIGHT'], price: '₹4,500' },
    { from: 'Ahmedabad', to: 'Srinagar', modes: ['BUS', 'FLIGHT'], price: '₹5,100' },
    { from: 'Delhi', to: 'Jaipur', modes: ['BUS', 'TRAIN'], price: '₹450' },
    { from: 'Pune', to: 'Delhi', modes: ['TRAIN', 'FLIGHT'], price: '₹3,800' },
]

const ModeIcon = ({ mode }) => {
    if (mode === 'FLIGHT') return <Plane className="w-3 h-3 text-sky-400" />
    if (mode === 'TRAIN') return <Train className="w-3 h-3 text-emerald-400" />
    return <Bus className="w-3 h-3 text-amber-400" />
}

export default function LandingPage() {
    const navigate = useNavigate()

    const handleSearch = (params) => {
        navigate('/search', { state: { searchParams: params } })
    }

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">

                {/* Decorative Blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto animate-slide-up">
                    <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
                        <Zap className="w-3.5 h-3.5" />
                        India's First Multi-Modal Travel Platform
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                        Travel Smarter.<br />
                        <span className="bg-gradient-to-r from-primary-400 to-sky-400 bg-clip-text text-transparent">
                            Go Further.
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Combine flights, trains, and buses into one seamless multi-modal journey.
                        Find the best route for your destination — based on price, time, or balance.
                    </p>

                    {/* Transport Mode Badges */}
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="badge-flight text-sm"><Plane className="w-3.5 h-3.5" />Flight</span>
                        <span className="badge-train text-sm"><Train className="w-3.5 h-3.5" />Train</span>
                        <span className="badge-bus text-sm"><Bus className="w-3.5 h-3.5" />Bus</span>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto w-full">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-6 mt-12 max-w-lg mx-auto">
                        {stats.map(s => (
                            <div key={s.label} className="text-center">
                                <div className="text-2xl font-black text-white">{s.value}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Routes */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-2">Popular Routes</h2>
                    <p className="text-gray-500 text-center mb-10">Curated multi-modal journeys, ready to book</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {popularRoutes.map((r, i) => (
                            <button
                                key={i}
                                onClick={() => navigate('/search', { state: { searchParams: { originCity: r.from, destinationCity: r.to, travelDate: new Date().toISOString().split('T')[0], optimizationMode: 'BALANCED' } } })}
                                className="glass p-4 text-left hover:border-primary-500/30 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        {r.modes.map((m, j) => (
                                            <span key={j} className="flex items-center gap-1">
                                                {j > 0 && <span className="text-gray-600">+</span>}
                                                <ModeIcon mode={m} />
                                                <span className="capitalize text-xs">{m.toLowerCase()}</span>
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-primary-400 font-bold text-sm">From {r.price}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white font-semibold group-hover:text-primary-300 transition-colors">
                                    {r.from}
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                    {r.to}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-dark-800/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-2">Why Choose Tripline?</h2>
                    <p className="text-gray-500 text-center mb-12">Built for the modern traveller</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="glass p-6 hover:border-white/10 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to travel smarter?</h2>
                    <p className="text-gray-400 mb-8">Join thousands of travellers who plan multi-modal journeys with Tripline.</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="btn-primary text-base px-10 py-4"
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-primary-600" />
                        <span className="text-white font-semibold">Tripline</span>
                    </div>
                    <p>© {new Date().getFullYear()} Tripline. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
