import { useEffect, useState } from 'react'
import { bookingApi } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import JourneyTimeline from '../components/JourneyTimeline'
import toast from 'react-hot-toast'
import { Ticket, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, User, Settings } from 'lucide-react'

const STATUS_STYLES = {
    PAID: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
    PAYMENT_INITIATED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    REFUNDED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

const STATUS_ICON = {
    PAID: <CheckCircle className="w-3.5 h-3.5" />,
    PENDING: <Clock className="w-3.5 h-3.5" />,
    CANCELLED: <XCircle className="w-3.5 h-3.5" />,
    PAYMENT_INITIATED: <AlertCircle className="w-3.5 h-3.5" />,
}

function BookingCard({ booking }) {
    const [expanded, setExpanded] = useState(false)

    const legs = booking.tickets?.map(t => ({
        tripId: t.tripId,
        originCity: t.trip?.originStation?.city,
        originStation: t.trip?.originStation?.name,
        destinationCity: t.trip?.destinationStation?.city,
        destinationStation: t.trip?.destinationStation?.name,
        departureTime: t.trip?.departureTime,
        arrivalTime: t.trip?.arrivalTime,
        transportMode: t.trip?.transportMode,
        carrierName: t.trip?.vehicle?.carrier?.name,
        price: t.legPrice,
        layoverMinutesNextLeg: 0,
    })) || []

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold">Booking #{booking.bookingId}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING}`}>
                            {STATUS_ICON[booking.status]}
                            {booking.status}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-white font-bold text-lg">₹{Number(booking.totalPrice).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => setExpanded(v => !v)} className="btn-ghost p-2">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {expanded && legs.length > 0 && (
                <div className="border-t border-white/5 px-5 pt-4 pb-5 animate-fade-in">
                    <JourneyTimeline legs={legs} />
                </div>
            )}
        </div>
    )
}

export default function DashboardPage() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('bookings')

    useEffect(() => {
        bookingApi.getUserBookings()
            .then(res => setBookings(res.data))
            .catch(() => toast.error('Failed to load bookings'))
            .finally(() => setLoading(false))
    }, [])

    const activeBookings = bookings.filter(b => ['PAID', 'PENDING', 'PAYMENT_INITIATED'].includes(b.status))
    const pastBookings = bookings.filter(b => ['CANCELLED', 'REFUNDED', 'COMPLETED'].includes(b.status))

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 animate-slide-up">
                    <div className="w-14 h-14 bg-primary-600/20 border border-primary-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-400">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Trips', value: bookings.length },
                        { label: 'Active Bookings', value: activeBookings.length },
                        { label: 'Past Trips', value: pastBookings.length },
                    ].map(s => (
                        <div key={s.label} className="glass p-4 text-center">
                            <p className="text-2xl font-black text-white">{s.value}</p>
                            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bookings List */}
                <div>
                    <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary-400" /> My Bookings
                    </h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="glass-card p-5 animate-pulse">
                                    <div className="h-5 w-40 bg-dark-600 rounded mb-2" />
                                    <div className="h-4 w-24 bg-dark-600 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-gray-300 font-semibold mb-2">No bookings yet</h3>
                            <p className="text-gray-500 text-sm mb-6">Plan your first multi-modal journey!</p>
                            <a href="/" className="btn-primary inline-flex">Search Routes</a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map(b => <BookingCard key={b.bookingId} booking={b} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
