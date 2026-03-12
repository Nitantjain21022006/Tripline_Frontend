import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CARRIERS = [
    { name: 'IndiGo', type: 'FLIGHT', code: '6E', color: '#1a56db', textColor: '#fff', emoji: '✈️', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/IndiGo_Airlines_logo.svg' },
    { name: 'Air India', type: 'FLIGHT', code: 'AI', color: '#c41e3a', textColor: '#fff', emoji: '✈️', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Air_India_Logo_2023.svg' },
    { name: 'SpiceJet', type: 'FLIGHT', code: 'SG', color: '#f97316', textColor: '#fff', emoji: '✈️', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/SpiceJet_Logo.svg/1200px-SpiceJet_Logo.svg.png' },
    { name: 'Vistara', type: 'FLIGHT', code: 'UK', color: '#6d28d9', textColor: '#fff', emoji: '✈️', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png' },
    { name: 'Indian Railways', type: 'TRAIN', code: 'IR', color: '#065f46', textColor: '#fff', emoji: '🚂', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/IRCTC_Logo.svg/1200px-IRCTC_Logo.svg.png' },
    { name: 'KSRTC', type: 'BUS', code: 'KS', color: '#b45309', textColor: '#fff', emoji: '🚌', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/KSRTC_Logo.svg/1200px-KSRTC_Logo.svg.png' },
    { name: 'MSRTC', type: 'BUS', code: 'MS', color: '#1e40af', textColor: '#fff', emoji: '🚌', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/MSRTC_Logo.svg/1200px-MSRTC_Logo.svg.png' },
    { name: 'SRS Travels', type: 'BUS', code: 'SR', color: '#7c3aed', textColor: '#fff', emoji: '🚌' },
]

const typeLabel = { FLIGHT: 'Airline', TRAIN: 'Railway', BUS: 'Bus Operator' }
const typeBadge = {
    FLIGHT: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    TRAIN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    BUS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const CarrierLogo = ({ carrier }) => {
    const [imgError, setImgError] = useState(false);

    if (carrier.logoUrl && !imgError) {
        return (
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-200">
                <img 
                    src={carrier.logoUrl} 
                    alt={carrier.name} 
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain p-2"
                />
            </div>
        )
    }

    return (
        <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 font-black text-white shadow-lg group-hover:scale-110 transition-transform duration-200"
            style={{ backgroundColor: carrier.color }}
        >
            {carrier.code}
        </div>
    )
}

export default function CarrierCarousel() {
    const scrollRef = useRef(null)

    const scroll = (dir) => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 240, behavior: 'smooth' })
    }

    return (
        <section className="py-4 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Partner Carriers</h2>
                        <p className="text-gray-500 text-sm mt-1">Trusted airlines, railways and bus operators</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll(-1)} className="w-9 h-9 bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center hover:bg-dark-600 transition-all hover:scale-105 active:scale-95">
                            <ChevronLeft className="w-4 h-4 text-gray-300" />
                        </button>
                        <button onClick={() => scroll(1)} className="w-9 h-9 bg-dark-700 border border-white/10 rounded-xl flex items-center justify-center hover:bg-dark-600 transition-all hover:scale-105 active:scale-95">
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {CARRIERS.map((carrier, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-48 glass-card bg-white/60 dark:bg-dark-800/60 p-5 hover:border-primary-500/30 dark:hover:border-primary-500/30 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group cursor-pointer"
                        >
                            <CarrierLogo carrier={carrier} />
                            <p className="text-gray-900 dark:text-white font-semibold text-sm">{carrier.name}</p>
                            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1.5 ${typeBadge[carrier.type]}`}>
                                {typeLabel[carrier.type]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
