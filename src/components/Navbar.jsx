import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Map, User, LogOut, LayoutDashboard, Shield, Menu, X, Plane } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        toast.success('Logged out successfully')
        navigate('/')
        setMenuOpen(false)
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                            <Plane className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">
                            Trip<span className="text-primary-400">line</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/" className={`btn-ghost text-sm ${isActive('/') ? 'text-white bg-dark-600' : ''}`}>
                            Home
                        </Link>
                        {isAuthenticated && (
                            <Link to="/dashboard" className={`btn-ghost text-sm ${isActive('/dashboard') ? 'text-white bg-dark-600' : ''}`}>
                                My Trips
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin" className={`btn-ghost text-sm text-purple-400 ${isActive('/admin') ? 'bg-dark-600' : ''}`}>
                                <Shield className="w-3.5 h-3.5 inline mr-1" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600/20 border border-primary-500/30 rounded-full flex items-center justify-center">
                                    <span className="text-primary-400 font-semibold text-sm">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-300">{user?.name?.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                                <Link to="/register" className="btn-primary text-sm py-2">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden btn-ghost p-2" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2 animate-fade-in">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="block btn-ghost text-sm">Home</Link>
                    {isAuthenticated && (
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block btn-ghost text-sm">My Trips</Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="block btn-ghost text-sm text-purple-400">
                            <Shield className="w-3.5 h-3.5 inline mr-1" />Admin Panel
                        </Link>
                    )}
                    <div className="border-t border-white/10 pt-3 mt-3">
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="block w-full text-left btn-ghost text-sm text-red-400">
                                Sign Out
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-sm text-center">Sign In</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
