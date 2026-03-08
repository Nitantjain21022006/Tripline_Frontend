import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LogIn, Eye, EyeOff, Plane } from 'lucide-react'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPwd, setShowPwd] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(form)
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center px-4">
            {/* Decorative blob */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-primary-600/30">
                        <Plane className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                    <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPwd ? 'text' : 'password'}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="input-field pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button type="button" onClick={() => setShowPwd(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}
