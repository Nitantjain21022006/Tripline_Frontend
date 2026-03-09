import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { UserPlus, Eye, EyeOff, Plane } from 'lucide-react'

export default function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'USER' })
    const [showPwd, setShowPwd] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
        setLoading(true)
        try {
            await register(form)
            toast.success('Account created! Please verify your email 📧')
            navigate('/verify-email', { state: { email: form.email } })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-10">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-primary-600/30">
                        <Plane className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create account</h1>
                    <p className="text-gray-500 mt-2">Start your multi-modal journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input type="text" value={form.name} onChange={set('name')} required
                            className="input-field" placeholder="Nitant Jain" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                        <input type="email" value={form.email} onChange={set('email')} required
                            className="input-field" placeholder="you@example.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone (optional)</label>
                        <input type="tel" value={form.phone} onChange={set('phone')}
                            className="input-field" placeholder="+91 98765 43210" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
                        <select value={form.role} onChange={set('role')} required
                            className="input-field appearance-none bg-gray-800/50">
                            <option value="USER" className="bg-gray-800">Traveler</option>
                            <option value="ADMIN" className="bg-gray-800">Administrator</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                                className="input-field pr-12" placeholder="Min 6 characters" />
                            <button type="button" onClick={() => setShowPwd(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
