import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { bookingApi } from '../api/axios'
import JourneyTimeline from '../components/JourneyTimeline'
import { CheckCircle, Download, LayoutDashboard, Ticket } from 'lucide-react'

export default function PaymentSuccessPage() {
    const [params] = useSearchParams()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // The booking is confirmed via webhook. We poll once to get it.
        const timer = setTimeout(async () => {
            try {
                const res = await bookingApi.getUserBookings()
                const latest = res.data?.[0]
                setBooking(latest)
            } catch { } finally { setLoading(false) }
        }, 2000) // 2 second delay to give webhook time to process
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Banner */}
                <div className="text-center mb-8 animate-slide-up">
                    <div className="relative inline-flex">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse-slow" />
                        <div className="relative w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white mt-4 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-400">
                        Your tickets are confirmed. A confirmation email has been sent to your inbox.
                    </p>
                </div>

                {/* Booking Card */}
                {loading ? (
                    <div className="glass-card p-6 animate-pulse">
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 w-full bg-dark-600 rounded-lg" />
                            ))}
                        </div>
                    </div>
                ) : booking ? (
                    <div className="glass-card p-6 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Booking Reference</p>
                                <p className="text-white font-bold text-xl">#{booking.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
                                <p className="text-primary-400 font-bold text-xl">₹{Number(booking.totalPrice).toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        {booking.tickets?.length > 0 && (
                            <div>
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-primary-400" /> Journey Details
                                </h3>
                                <JourneyTimeline
                                    legs={booking.tickets.map(t => ({
                                        tripId: t.tripId,
                                        originCity: t.originCity || t.trip?.originStation?.city,
                                        originStation: t.trip?.originStation?.name,
                                        destinationCity: t.destinationCity || t.trip?.destinationStation?.city,
                                        destinationStation: t.trip?.destinationStation?.name,
                                        departureTime: t.trip?.departureTime,
                                        arrivalTime: t.trip?.arrivalTime,
                                        transportMode: t.trip?.transportMode,
                                        carrierName: t.trip?.vehicle?.carrier?.name,
                                        price: t.legPrice,
                                        layoverMinutesNextLeg: 0,
                                    }))}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="glass-card p-6 text-center">
                        <p className="text-gray-400">Your booking is being processed. Check My Trips for details.</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link to="/dashboard" className="btn-primary flex-1 flex items-center justify-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> View My Trips
                    </Link>
                    <Link to="/" className="btn-outline flex-1 flex items-center justify-center gap-2">
                        Plan Another Journey
                    </Link>
                </div>
            </div>
        </div>
    )
}
