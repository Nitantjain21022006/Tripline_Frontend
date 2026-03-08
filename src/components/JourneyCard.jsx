import { useState } from 'react'
import { Clock, IndianRupee, ArrowRight, ChevronDown, ChevronUp, Plane, Train, Bus, Zap } from 'lucide-react'
import JourneyTimeline from './JourneyTimeline'

function formatDuration(minutes) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatTime(dt) {
    if (!dt) return '--'
    return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const MiniModeIcon = ({ mode }) => {
    if (mode === 'FLIGHT') return <Plane className="w-3.5 h-3.5 text-sky-400" />
    if (mode === 'TRAIN') return <Train className="w-3.5 h-3.5 text-emerald-400" />
    return <Bus className="w-3.5 h-3.5 text-amber-400" />
}

export default function JourneyCard({ route, onSelect, selected = false }) {
    const [expanded, setExpanded] = useState(false)
    const { legs = [], totalPrice, totalDurationMinutes, transfers, departureTime, arrivalTime, totalLayoverMinutes } = route

    const uniqueModes = [...new Set(legs.map(l => l.transportMode))]

    return (
        <div className={`glass-card overflow-hidden transition-all duration-300 hover:border-primary-500/30 cursor-pointer
      ${selected ? 'border-primary-500/60 shadow-primary-600/20 shadow-lg' : ''}`}
            onClick={() => setExpanded(e => !e)}
        >
            {/* Summary Row */}
            <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Time + Route */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 text-white">
                            <span className="text-xl font-bold font-mono">{formatTime(departureTime)}</span>
                            <div className="flex items-center gap-1">
                                {uniqueModes.map((m, i) => (
                                    <span key={i} className="flex items-center gap-0.5">
                                        {i > 0 && <ArrowRight className="w-3 h-3 text-gray-600" />}
                                        <MiniModeIcon mode={m} />
                                    </span>
                                ))}
                            </div>
                            <span className="text-xl font-bold font-mono">{formatTime(arrivalTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span>{legs[0]?.originCity}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span>{legs[legs.length - 1]?.destinationCity}</span>
                            {transfers > 0 && (
                                <span className="bg-dark-600 text-gray-400 px-2 py-0.5 rounded-full">
                                    {transfers} stop{transfers > 1 ? 's' : ''}
                                </span>
                            )}
                            {transfers === 0 && (
                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-xs border border-emerald-500/20">
                                    Direct
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Center: Duration */}
                    <div className="hidden sm:flex flex-col items-center text-center">
                        <span className="text-gray-400 text-sm"><Clock className="w-3.5 h-3.5 inline mr-1" />{formatDuration(totalDurationMinutes)}</span>
                        {totalLayoverMinutes > 0 && (
                            <span className="text-gray-600 text-xs mt-0.5">{formatDuration(totalLayoverMinutes)} layover</span>
                        )}
                    </div>

                    {/* Right: Price + CTA */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-2xl font-bold text-white">
                            ₹<span>{Number(totalPrice).toLocaleString('en-IN')}</span>
                        </div>
                        <button
                            className={`btn-primary text-sm py-2 px-4 ${selected ? 'bg-primary-500' : ''}`}
                            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(route) }}
                        >
                            {selected ? 'Selected ✓' : 'Book Now'}
                        </button>
                    </div>
                </div>

                {/* Expand Toggle */}
                <button
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mt-3 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
                >
                    {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expanded ? 'Hide details' : 'Show flight details'}
                </button>
            </div>

            {/* Expanded Timeline */}
            {expanded && (
                <div className="border-t border-white/5 px-5 pt-4 pb-5 animate-fade-in">
                    <JourneyTimeline legs={legs} />
                </div>
            )}
        </div>
    )
}
