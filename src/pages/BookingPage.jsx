import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookingApi, paymentApi } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import JourneyTimeline from '../components/JourneyTimeline'
import toast from 'react-hot-toast'
import { User, Plus, Trash2, CreditCard, ArrowRight } from 'lucide-react'

const emptyPassenger = () => ({ name: '', age: '', gender: 'MALE' })

export default function BookingPage() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const route = state?.route
    const [passengers, setPassengers] = useState([{ ...emptyPassenger(), name: user?.name || '', age: '' }])
    const [loading, setLoading] = useState(false)

    if (!route) {
        navigate('/search')
        return null
    }

    const addPassenger = () => {
        if (passengers.length >= (route.legs?.[0]?.availableSeats || 9)) {
            toast.error('Max passengers reached for this route')
            return
        }
        setPassengers(p => [...p, emptyPassenger()])
    }

    const removePassenger = (i) => {
        if (passengers.length <= 1) return
        setPassengers(p => p.filter((_, idx) => idx !== i))
    }

    const setField = (i, key, val) => {
        setPassengers(p => p.map((p2, idx) => idx === i ? { ...p2, [key]: val } : p2))
    }

    const handleBook = async (e) => {
        e.preventDefault()
        for (const p of passengers) {
            if (!p.name.trim() || !p.age) { toast.error('Please fill all passenger details'); return }
            if (Number(p.age) < 1 || Number(p.age) > 120) { toast.error('Invalid age'); return }
        }

        setLoading(true)
        try {
            // Step 1: Create booking (PENDING status)
            const tripIds = route.legs.map(l => l.tripId)
            const bookingRes = await bookingApi.create({
                tripIds,
                passengers: passengers.map(p => ({ ...p, age: Number(p.age) }))
            })
            const bookingId = bookingRes.data.bookingId

            // Step 2: Create Stripe checkout session
            const sessionRes = await paymentApi.createSession({ bookingId })
            const sessionUrl = sessionRes.data.sessionUrl

            // Step 3: Redirect to Stripe
            window.location.href = sessionUrl
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
            setLoading(false)
        }
    }

    const totalPrice = Number(route.totalPrice) * passengers.length

    return (
        <div className="min-h-screen pt-20 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-3xl font-bold text-white mb-1">Complete Booking</h1>
                    <p className="text-gray-500">Enter passenger details and proceed to payment</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Passenger Form */}
                    <form onSubmit={handleBook} className="lg:col-span-2 space-y-6">
                        {passengers.map((p, i) => (
                            <div key={i} className="glass-card p-6 animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-600/20 border border-primary-500/30 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary-400" />
                                        </div>
                                        <h3 className="text-white font-semibold">Passenger {i + 1}</h3>
                                    </div>
                                    {i > 0 && (
                                        <button type="button" onClick={() => removePassenger(i)}
                                            className="text-red-400 hover:text-red-300 p-1 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-1">
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">Full Name</label>
                                        <input type="text" required value={p.name} onChange={e => setField(i, 'name', e.target.value)}
                                            className="input-field" placeholder="Full name" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">Age</label>
                                        <input type="number" required min="1" max="120" value={p.age} onChange={e => setField(i, 'age', e.target.value)}
                                            className="input-field" placeholder="Age" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">Gender</label>
                                        <select value={p.gender} onChange={e => setField(i, 'gender', e.target.value)} className="input-field">
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addPassenger}
                            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                            <Plus className="w-4 h-4" /> Add Passenger
                        </button>

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <CreditCard className="w-5 h-5" />
                            )}
                            {loading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')} via Stripe`}
                        </button>
                    </form>

                    {/* Right: Journey Summary */}
                    <div className="space-y-4">
                        <div className="glass-card p-5">
                            <h3 className="text-white font-semibold mb-4">Journey Summary</h3>
                            <JourneyTimeline legs={route.legs} compact={false} />
                            <div className="border-t border-white/5 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Base fare × {passengers.length}</span>
                                    <span className="text-white">₹{Number(route.totalPrice).toLocaleString('en-IN')} each</span>
                                </div>
                                <div className="flex justify-between font-bold text-white">
                                    <span>Total</span>
                                    <span className="text-xl text-primary-400">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-4 text-xs text-gray-500 leading-relaxed">
                            <CreditCard className="w-4 h-4 text-gray-400 mb-2" />
                            Payment is securely processed by Stripe. Your card details are never stored on our servers.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
