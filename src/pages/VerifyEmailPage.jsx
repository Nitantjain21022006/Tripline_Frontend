import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function VerifyEmailPage() {
    const { verifyEmail } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const email = location.state?.email

    useEffect(() => {
        if (!email) {
            toast.error('Session expired. Please register again.')
            navigate('/register')
        }
    }, [email, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP')
            return
        }
        setLoading(true)
        try {
            await verifyEmail({ email, otp })
            toast.success('Email verified! Redirecting to dashboard...')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center px-4">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-primary-600/30">
                        <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Verify your email</h1>
                    <p className="text-gray-400 mt-2">
                        We've sent a 6-digit code to <br />
                        <span className="text-primary-400 font-medium">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                            Enter Verification Code
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            required
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-4 text-center text-3xl font-bold tracking-[0.5em] text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            placeholder="000000"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShieldCheck className="w-5 h-5" />
                                <span>Verify & Continue</span>
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => toast.success('A new OTP has been sent (Mocked)')}
                            className="text-sm text-gray-500 hover:text-primary-400 transition-colors"
                        >
                            Didn't receive the code? Resend
                        </button>
                    </div>
                </form>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/register')}
                        className="text-gray-500 hover:text-white inline-flex items-center gap-2 text-sm transition-colors"
                    >
                        Back to Register
                    </button>
                </div>
            </div>
        </div>
    )
}
