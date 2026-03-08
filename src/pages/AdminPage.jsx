import { useEffect, useState } from 'react'
import { adminApi } from '../api/axios'
import toast from 'react-hot-toast'
import { Plane, Train, Bus, Building2, MapPin, Route, Settings, Plus, Trash2, RefreshCw, Users } from 'lucide-react'

const TABS = [
    { id: 'carriers', label: 'Carriers', icon: <Building2 className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Plane className="w-4 h-4" /> },
    { id: 'stations', label: 'Stations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'trips', label: 'Trips', icon: <Route className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Users className="w-4 h-4" /> },
    { id: 'config', label: 'Config', icon: <Settings className="w-4 h-4" /> },
]

// --- Reusable sub-components ---

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">{label}</label>
            {children}
        </div>
    )
}

function Input({ ...props }) {
    return <input {...props} className="input-field" />
}

function Select({ options, ...props }) {
    return (
        <select {...props} className="input-field">
            {options.map(o => (
                <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
            ))}
        </select>
    )
}

function ListItem({ title, subtitle, onDelete }) {
    return (
        <div className="flex items-center justify-between p-3 bg-dark-700 rounded-xl">
            <div>
                <p className="text-white text-sm font-medium">{title}</p>
                {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
            </div>
            {onDelete && (
                <button onClick={onDelete} className="text-red-400 hover:text-red-300 p-1 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}

// --- Tab contents ---

function CarriersTab() {
    const [carriers, setCarriers] = useState([])
    const [form, setForm] = useState({ name: '', contactEmail: '', contactPhone: '', logoUrl: '' })
    const [loading, setLoading] = useState(false)

    const load = () => adminApi.getCarriers().then(r => setCarriers(r.data)).catch(() => { })
    useEffect(() => { load() }, [])

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try { await adminApi.createCarrier({ ...form, isActive: true }); toast.success('Carrier added'); load(); setForm({ name: '', contactEmail: '', contactPhone: '', logoUrl: '' }) }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submit} className="glass-card p-5 space-y-4">
                <h3 className="text-white font-semibold">Add Carrier</h3>
                <Field label="Name"><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="IndiGo" /></Field>
                <Field label="Email"><Input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} placeholder="support@carrier.com" /></Field>
                <Field label="Phone"><Input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} placeholder="+91 99999 99999" /></Field>
                <Field label="Logo URL"><Input value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." /></Field>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Carrier
                </button>
            </form>
            <div className="space-y-3">
                <h3 className="text-white font-semibold">Existing Carriers ({carriers.length})</h3>
                {carriers.map(c => (
                    <ListItem key={c.id} title={c.name} subtitle={c.contactEmail}
                        onDelete={() => adminApi.deleteCarrier(c.id).then(load).catch(() => toast.error('Failed to delete'))} />
                ))}
                {carriers.length === 0 && <p className="text-gray-600 text-sm">No carriers yet.</p>}
            </div>
        </div>
    )
}

function VehiclesTab() {
    const [vehicles, setVehicles] = useState([])
    const [carriers, setCarriers] = useState([])
    const [form, setForm] = useState({ name: '', vehicleNumber: '', transportMode: 'FLIGHT', capacity: 180, carrierId: '' })
    const [loading, setLoading] = useState(false)

    const load = () => Promise.all([adminApi.getVehicles(), adminApi.getCarriers()])
        .then(([v, c]) => { setVehicles(v.data); setCarriers(c.data); if (c.data[0]) setForm(f => ({ ...f, carrierId: c.data[0].id })) })
        .catch(() => { })
    useEffect(() => { load() }, [])

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try { await adminApi.createVehicle({ ...form, capacity: Number(form.capacity), isActive: true }); toast.success('Vehicle added'); load() }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const modeOptions = [{ value: 'FLIGHT', label: '✈️ Flight' }, { value: 'TRAIN', label: '🚆 Train' }, { value: 'BUS', label: '🚌 Bus' }]

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submit} className="glass-card p-5 space-y-4">
                <h3 className="text-white font-semibold">Add Vehicle</h3>
                <Field label="Carrier">
                    <select value={form.carrierId} onChange={e => setForm({ ...form, carrierId: e.target.value })} className="input-field">
                        {carriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Name"><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="IndiGo 6E-401" /></Field>
                    <Field label="Vehicle No."><Input value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="6E-401" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Mode"><Select options={modeOptions} value={form.transportMode} onChange={e => setForm({ ...form, transportMode: e.target.value })} /></Field>
                    <Field label="Capacity"><Input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></Field>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Vehicle
                </button>
            </form>
            <div className="space-y-3">
                <h3 className="text-white font-semibold">Existing Vehicles ({vehicles.length})</h3>
                {vehicles.map(v => (
                    <ListItem key={v.id} title={v.name} subtitle={`${v.transportMode} • ${v.carrier?.name} • ${v.capacity} seats`} />
                ))}
                {vehicles.length === 0 && <p className="text-gray-600 text-sm">No vehicles yet.</p>}
            </div>
        </div>
    )
}

function StationsTab() {
    const [stations, setStations] = useState([])
    const [form, setForm] = useState({ name: '', city: '', state: '', country: 'India', type: 'AIRPORT', latitude: '', longitude: '' })
    const [loading, setLoading] = useState(false)

    const load = () => adminApi.getStations().then(r => setStations(r.data)).catch(() => { })
    useEffect(() => { load() }, [])

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            await adminApi.createStation({ ...form, latitude: Number(form.latitude), longitude: Number(form.longitude), isActive: true })
            toast.success('Station added'); load(); setForm({ name: '', city: '', state: '', country: 'India', type: 'AIRPORT', latitude: '', longitude: '' })
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const typeOptions = ['AIRPORT', 'TRAIN_STATION', 'BUS_TERMINAL']

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submit} className="glass-card p-5 space-y-4">
                <h3 className="text-white font-semibold">Add Station</h3>
                <Field label="Name"><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="SVPI Airport" /></Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="City"><Input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Ahmedabad" /></Field>
                    <Field label="State"><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Gujarat" /></Field>
                </div>
                <Field label="Type"><Select options={typeOptions} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Latitude"><Input type="number" step="any" required value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} placeholder="23.0727" /></Field>
                    <Field label="Longitude"><Input type="number" step="any" required value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} placeholder="72.6347" /></Field>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Station
                </button>
            </form>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                <h3 className="text-white font-semibold">Stations ({stations.length})</h3>
                {stations.map(s => (
                    <ListItem key={s.id} title={s.name} subtitle={`${s.city}, ${s.state} • ${s.type}`} />
                ))}
                {stations.length === 0 && <p className="text-gray-600 text-sm">No stations yet.</p>}
            </div>
        </div>
    )
}

function TripsTab() {
    const [trips, setTrips] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [stations, setStations] = useState([])
    const [form, setForm] = useState({ vehicleId: '', originStationId: '', destinationStationId: '', departureTime: '', arrivalTime: '', price: '', distance: '', availableSeats: '' })
    const [loading, setLoading] = useState(false)

    const load = () => Promise.all([adminApi.getTrips(), adminApi.getVehicles(), adminApi.getStations()])
        .then(([t, v, s]) => {
            setTrips(t.data); setVehicles(v.data); setStations(s.data)
            if (v.data[0]) setForm(f => ({ ...f, vehicleId: v.data[0].id }))
            if (s.data[0]) setForm(f => ({ ...f, originStationId: s.data[0].id, destinationStationId: s.data[0].id }))
        }).catch(() => { })
    useEffect(() => { load() }, [])

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            await adminApi.createTrip({ ...form, price: Number(form.price), distance: Number(form.distance), availableSeats: Number(form.availableSeats), isActive: true })
            toast.success('Trip added!'); load()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const dateInputProps = { type: 'datetime-local', className: 'input-field' }

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submit} className="glass-card p-5 space-y-4">
                <h3 className="text-white font-semibold">Add Trip</h3>
                <Field label="Vehicle">
                    <select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} className="input-field">
                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.transportMode})</option>)}
                    </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Origin Station">
                        <select value={form.originStationId} onChange={e => setForm({ ...form, originStationId: e.target.value })} className="input-field">
                            {stations.map(s => <option key={s.id} value={s.id}>{s.city} – {s.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Destination Station">
                        <select value={form.destinationStationId} onChange={e => setForm({ ...form, destinationStationId: e.target.value })} className="input-field">
                            {stations.map(s => <option key={s.id} value={s.id}>{s.city} – {s.name}</option>)}
                        </select>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Departure"><input {...dateInputProps} required value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} /></Field>
                    <Field label="Arrival"><input {...dateInputProps} required value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} /></Field>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <Field label="Price (₹)"><Input type="number" min="0" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1200" /></Field>
                    <Field label="Distance (km)"><Input type="number" min="0" required value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="540" /></Field>
                    <Field label="Seats"><Input type="number" min="1" required value={form.availableSeats} onChange={e => setForm({ ...form, availableSeats: e.target.value })} placeholder="180" /></Field>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Trip
                </button>
            </form>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                <h3 className="text-white font-semibold">Trips ({trips.length})</h3>
                {trips.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-xl">
                        <div>
                            <p className="text-white text-sm font-medium">{t.originStation?.city} → {t.destinationStation?.city}</p>
                            <p className="text-gray-500 text-xs">{t.transportMode} • ₹{t.price} • {new Date(t.departureTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                        <button onClick={() => adminApi.deleteTrip(t.id).then(load).catch(() => toast.error('Failed'))}
                            className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                ))}
                {trips.length === 0 && <p className="text-gray-600 text-sm">No trips yet.</p>}
            </div>
        </div>
    )
}

function BookingsTab() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        adminApi.getAllBookings().then(r => setBookings(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
    }, [])

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/5 text-left">
                        {['ID', 'User', 'Status', 'Total', 'Date'].map(h => (
                            <th key={h} className="pb-3 text-gray-500 font-semibold text-xs uppercase tracking-wider pr-4">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-600">Loading...</td></tr>
                    ) : bookings.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-600">No bookings yet</td></tr>
                    ) : bookings.map(b => (
                        <tr key={b.id} className="text-gray-300">
                            <td className="py-3 pr-4 font-mono text-white">#{b.id}</td>
                            <td className="py-3 pr-4">{b.user?.name}<br /><span className="text-gray-500 text-xs">{b.user?.email}</span></td>
                            <td className="py-3 pr-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-dark-600">{b.status}</span></td>
                            <td className="py-3 pr-4 text-primary-400 font-bold">₹{Number(b.totalPrice).toLocaleString('en-IN')}</td>
                            <td className="py-3 text-gray-500 text-xs">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ConfigTab() {
    const [configs, setConfigs] = useState([])
    const [form, setForm] = useState({ configKey: '', configValue: '', description: '' })
    const [loading, setLoading] = useState(false)

    const load = () => adminApi.getConfigs().then(r => setConfigs(r.data)).catch(() => { })
    useEffect(() => { load() }, [])

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try { await adminApi.upsertConfig(form); toast.success('Config saved'); load(); setForm({ configKey: '', configValue: '', description: '' }) }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submit} className="glass-card p-5 space-y-4">
                <h3 className="text-white font-semibold">Set Configuration</h3>
                <Field label="Key"><Input required value={form.configKey} onChange={e => setForm({ ...form, configKey: e.target.value })} placeholder="minimum_layover_minutes" /></Field>
                <Field label="Value"><Input required value={form.configValue} onChange={e => setForm({ ...form, configValue: e.target.value })} placeholder="120" /></Field>
                <Field label="Description"><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Minimum layover time in minutes" /></Field>
                <button type="submit" disabled={loading} className="btn-primary w-full">Save Config</button>
            </form>
            <div className="space-y-3">
                <h3 className="text-white font-semibold">Current Config</h3>
                {configs.map(c => (
                    <div key={c.configKey} className="p-3 bg-dark-700 rounded-xl">
                        <div className="flex justify-between">
                            <span className="text-primary-400 text-xs font-mono font-semibold">{c.configKey}</span>
                            <span className="text-white font-bold">{c.configValue}</span>
                        </div>
                        {c.description && <p className="text-gray-500 text-xs mt-1">{c.description}</p>}
                    </div>
                ))}
                {configs.length === 0 && <p className="text-gray-600 text-sm">No config yet.</p>}
            </div>
        </div>
    )
}

export default function AdminPage() {
    const [tab, setTab] = useState('carriers')

    const tabContent = {
        carriers: <CarriersTab />,
        vehicles: <VehiclesTab />,
        stations: <StationsTab />,
        trips: <TripsTab />,
        bookings: <BookingsTab />,
        config: <ConfigTab />,
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 animate-slide-up">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-purple-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-500 ml-11">Manage your Tripline platform data</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 flex-wrap mb-6 bg-dark-800/60 p-1.5 rounded-xl border border-white/5 w-fit">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all ${tab === t.id
                                    ? 'bg-primary-600 text-white font-semibold shadow-lg shadow-primary-600/25'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {t.icon}
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className="animate-fade-in">
                    {tabContent[tab]}
                </div>
            </div>
        </div>
    )
}
