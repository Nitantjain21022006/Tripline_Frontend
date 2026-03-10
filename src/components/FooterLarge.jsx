import { Link } from 'react-router-dom'
import { Plane, Train, Bus, Mail, Phone, Twitter, Facebook, Instagram, Linkedin, Youtube, ChevronRight } from 'lucide-react'

const FOOTER_LINKS = {
    'About Tripline': [
        { label: 'About Us', href: '#' },
        { label: 'Our Team', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Press', href: '#' },
    ],
    'Popular Routes': [
        { label: 'Delhi → Jaipur', href: '#' },
        { label: 'Mumbai → Delhi', href: '#' },
        { label: 'Ahmedabad → Mumbai', href: '#' },
        { label: 'Bangalore → Chennai', href: '#' },
        { label: 'Delhi → Srinagar', href: '#' },
    ],
    'Popular Airlines': [
        { label: 'IndiGo Flights', href: '#' },
        { label: 'Air India Flights', href: '#' },
        { label: 'SpiceJet Flights', href: '#' },
        { label: 'Vistara Flights', href: '#' },
        { label: 'GoAir Flights', href: '#' },
    ],
    'Top Train Routes': [
        { label: 'Delhi → Mumbai Train', href: '#' },
        { label: 'Mumbai → Goa Train', href: '#' },
        { label: 'Chennai → Bangalore', href: '#' },
        { label: 'Kolkata → Delhi', href: '#' },
        { label: 'Ahmedabad → Jaipur', href: '#' },
    ],
    'Customer Support': [
        { label: 'Help Center', href: '#' },
        { label: 'Cancellation Policy', href: '#' },
        { label: 'Refund Policy', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Live Chat', href: '#' },
    ],
    'Legal': [
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Disclaimer', href: '#' },
        { label: 'Accessibility', href: '#' },
    ],
}

const SOCIALS = [
    { Icon: Twitter, label: 'Twitter', color: 'hover:text-sky-400' },
    { Icon: Facebook, label: 'Facebook', color: 'hover:text-blue-400' },
    { Icon: Instagram, label: 'Instagram', color: 'hover:text-pink-400' },
    { Icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-300' },
    { Icon: Youtube, label: 'YouTube', color: 'hover:text-red-400' },
]

export default function FooterLarge() {
    return (
        <footer className="bg-dark-800/60 border-t border-white/5 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Top: Brand + App badges */}
                <div className="grid sm:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="sm:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 group mb-4">
                            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                <Plane className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Trip<span className="text-primary-400">line</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-xs leading-relaxed mb-5">
                            India's first multi-modal travel platform. Flights, trains and buses combined into a seamless journey.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-3 mb-5">
                            {SOCIALS.map(({ Icon, label, color }) => (
                                <a key={label} href="#" aria-label={label} className={`w-8 h-8 bg-dark-600 border border-white/5 rounded-lg flex items-center justify-center text-gray-500 ${color} hover:border-white/10 hover:scale-110 transition-all duration-200`}>
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>

                        {/* App Store Badges */}
                        <div className="flex gap-2 flex-wrap">
                            <a href="#" className="flex items-center gap-2 bg-dark-600 border border-white/10 text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-dark-500 hover:border-white/20 transition-all">
                                <span className="text-base">🍎</span>
                                <span>
                                    <div className="text-[9px] text-gray-400">Download on the</div>
                                    <div className="font-bold text-xs">App Store</div>
                                </span>
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-dark-600 border border-white/10 text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-dark-500 hover:border-white/20 transition-all">
                                <span className="text-base">▶</span>
                                <span>
                                    <div className="text-[9px] text-gray-400">Get it on</div>
                                    <div className="font-bold text-xs">Google Play</div>
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Link columns — 3 per row */}
                    <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                            <div key={section}>
                                <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-3">{section}</h4>
                                <ul className="space-y-2">
                                    {links.map(link => (
                                        <li key={link.label}>
                                            <a href={link.href} className="text-gray-500 text-xs hover:text-gray-300 transition-colors flex items-center gap-1 group">
                                                <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-primary-400 -ml-3.5 transition-all" />
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-4 text-gray-600 text-xs">
                            <span className="flex items-center gap-1">
                                <Plane className="w-3 h-3 text-sky-500/50" />
                                Flights
                            </span>
                            <span className="flex items-center gap-1">
                                <Train className="w-3 h-3 text-emerald-500/50" />
                                Trains
                            </span>
                            <span className="flex items-center gap-1">
                                <Bus className="w-3 h-3 text-amber-500/50" />
                                Buses
                            </span>
                        </div>
                        <p className="text-gray-600 text-xs">
                            © {new Date().getFullYear()} Tripline Technologies Pvt. Ltd. · All rights reserved.
                        </p>
                        <div className="flex items-center gap-3 text-gray-600 text-xs">
                            <a href="#" className="flex items-center gap-1 hover:text-gray-400 transition-colors">
                                <Mail className="w-3 h-3" />
                                support@tripline.in
                            </a>
                            <a href="#" className="flex items-center gap-1 hover:text-gray-400 transition-colors">
                                <Phone className="w-3 h-3" />
                                1800-123-TRIP
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
