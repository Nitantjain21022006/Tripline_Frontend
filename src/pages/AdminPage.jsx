import { useEffect, useState } from 'react'
import { adminApi } from '../api/axios'
import toast from 'react-hot-toast'
import {
    Plane, Train, Bus, Building2, MapPin, Route,
    Settings, Plus, Trash2, Users, ChevronDown,
    LayoutDashboard, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS / CONSTANTS
═══════════════════════════════════════════════════════ */
const TABS = [
    { id: 'carriers',  label: 'Carriers',  icon: Building2, color: 'text-violet-500' },
    { id: 'vehicles',  label: 'Vehicles',  icon: Plane,     color: 'text-sky-500'    },
    { id: 'stations',  label: 'Stations',  icon: MapPin,    color: 'text-emerald-500'},
    { id: 'trips',     label: 'Trips',     icon: Route,     color: 'text-amber-500'  },
    { id: 'bookings',  label: 'Bookings',  icon: Users,     color: 'text-rose-500'   },
    { id: 'config',    label: 'Config',    icon: Settings,  color: 'text-gray-500'   },
]

/* ═══════════════════════════════════════════════════════
   PRIMITIVE COMPONENTS
═══════════════════════════════════════════════════════ */
function SectionCard({ title, subtitle, children, action }) {
    return (
        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/8 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
            {(title || action) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
                        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {action}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    )
}

function FieldGroup({ label, helper, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</label>
            {children}
            {helper && <p className="text-xs text-gray-400 dark:text-gray-500">{helper}</p>}
        </div>
    )
}

function AdminInput({ className = '', ...props }) {
    return (
        <input
            {...props}
            className={`w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 ${className}`}
        />
    )
}

function AdminSelect({ options = [], className = '', ...props }) {
    return (
        <select
            {...props}
            className={`w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 cursor-pointer appearance-none ${className}`}
        >
            {options.map(o => (
                <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
            ))}
        </select>
    )
}

function SubmitBtn({ loading, label, icon: Icon = Plus }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95 text-sm"
        >
            {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Icon className="w-4 h-4" />
            }
            {label}
        </button>
    )
}

function EmptyState({ message }) {
    return (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{message}</p>
        </div>
    )
}

function RecordRow({ primary, secondary, extra, onDelete }) {
    return (
        <div className="flex items-center justify-between py-3 px-1 border-b border-gray-100 dark:border-white/5 last:border-0 group">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{primary}</p>
                {secondary && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{secondary}</p>}
                {extra}
            </div>
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="ml-3 p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   TAB: CARRIERS
═══════════════════════════════════════════════════════ */
function CarriersTab() {
    const [carriers, setCarriers] = useState([])
    const [form, setForm] = useState({ name: '', contactEmail: '', contactPhone: '', logoUrl: '' })
    const [loading, setLoading] = useState(false)

    const load = () => adminApi.getCarriers().then(r => setCarriers(Array.isArray(r.data) ? r.data : [])).catch(() => {})
    useEffect(() => { load() }, [])

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    const submit = async e => {
        e.preventDefault(); setLoading(true)
        try {
            await adminApi.createCarrier({ ...form, isActive: true })
            toast.success('Carrier added successfully')
            load()
            setForm({ name: '', contactEmail: '', contactPhone: '', logoUrl: '' })
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
                <SectionCard title="Add New Carrier" subtitle="Create a transport carrier record">
                    <form onSubmit={submit} className="space-y-4">
                        <FieldGroup label="Carrier Name">
                            <AdminInput required value={form.name} onChange={set('name')} placeholder="e.g. IndiGo Airlines" />
                        </FieldGroup>
                        <FieldGroup label="Contact Email">
                            <AdminInput type="email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="support@carrier.com" />
                        </FieldGroup>
                        <FieldGroup label="Contact Phone">
                            <AdminInput value={form.contactPhone} onChange={set('contactPhone')} placeholder="+91 99999 99999" />
                        </FieldGroup>
                        <FieldGroup label="Logo URL" helper="Optional — paste a link to the carrier logo">
                            <AdminInput value={form.logoUrl} onChange={set('logoUrl')} placeholder="https://..." />
                        </FieldGroup>
                        <SubmitBtn loading={loading} label="Add Carrier" />
                    </form>
                </SectionCard>
            </div>

            <div className="lg:col-span-3">
                <SectionCard
                    title={`Carriers (${carriers.length})`}
                    subtitle="All registered transport carriers"
                    action={<button onClick={load} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>}
                >
                    {carriers.length === 0
                        ? <EmptyState message="No carriers yet. Add one to get started." />
                        : carriers.map(c => (
                            <RecordRow
                                key={c.id}
                                primary={c.name}
                                secondary={c.contactEmail || c.contactPhone || 'No contact info'}
                                onDelete={() => adminApi.deleteCarrier(c.id).then(load).catch(() => toast.error('Failed to delete'))}
                            />
                        ))
                    }
                </SectionCard>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   TAB: VEHICLES
═══════════════════════════════════════════════════════ */
function VehiclesTab() {
    const [vehicles, setVehicles] = useState([])
    const [carriers, setCarriers] = useState([])
    const [form, setForm] = useState({ name: '', vehicleNumber: '', transportMode: 'FLIGHT', capacity: 180, carrierId: '' })
    const [loading, setLoading] = useState(false)
    const [flightCategories, setFlightCategories] = useState([
        { name: 'Business', rowStart: '1', rowEnd: '5', price: '8000' },
        { name: 'Economy', rowStart: '6', rowEnd: '30', price: '2500' },
    ])
    const [flightCols, setFlightCols] = useState('A,B,C,D,E,F')
    const [trainCoaches, setTrainCoaches] = useState([
        { coachNo: 'A1', seatClass: '1AC', seats: '24', price: '3500' },
        { coachNo: 'B1', seatClass: '2AC', seats: '48', price: '2000' },
        { coachNo: 'S1', seatClass: 'Sleeper', seats: '72', price: '600' },
    ])
    const [busRows, setBusRows] = useState('12')
    const [busCols, setBusCols] = useState('A,B,C,D')
    const [busPrice, setBusPrice] = useState('')

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    const load = () => Promise.all([adminApi.getVehicles(), adminApi.getCarriers()])
        .then(([v, c]) => {
            const vArr = Array.isArray(v.data) ? v.data : []
            const cArr = Array.isArray(c.data) ? c.data : []
            setVehicles(vArr); setCarriers(cArr)
            if (cArr[0]) setForm(f => ({ ...f, carrierId: cArr[0].id }))
        }).catch(() => {})
    useEffect(() => { load() }, [])

    const addFlightCat = () => setFlightCategories(fc => [...fc, { name: '', rowStart: '', rowEnd: '', price: '' }])
    const removeFlightCat = i => setFlightCategories(fc => fc.filter((_, idx) => idx !== i))
    const setFlightCat = (i, k, v) => setFlightCategories(fc => fc.map((c, idx) => idx === i ? { ...c, [k]: v } : c))

    const addTrainCoach = () => setTrainCoaches(tc => [...tc, { coachNo: '', seatClass: '', seats: '72', price: '' }])
    const removeTrainCoach = i => setTrainCoaches(tc => tc.filter((_, idx) => idx !== i))
    const setTrainCoach = (i, k, v) => setTrainCoaches(tc => tc.map((c, idx) => idx === i ? { ...c, [k]: v } : c))

    const buildPayload = () => {
        const mode = form.transportMode
        if (mode === 'FLIGHT') {
            const cols = flightCols.split(',').map(s => s.trim()).filter(Boolean)
            const seat_classes = {}
            for (const cat of flightCategories) {
                if (cat.name && cat.rowStart && cat.rowEnd) {
                    seat_classes[cat.name] = { rows: `${cat.rowStart}-${cat.rowEnd}` }
                    if (cat.price) seat_classes[cat.name].price = Number(cat.price)
                }
            }
            const maxRow = Number(flightCategories[flightCategories.length - 1]?.rowEnd || 30)
            const seatClasses = {}
            for (const cat of flightCategories) { if (cat.name && cat.price) seatClasses[cat.name] = Number(cat.price) }
            return { seatLayout: { rows: maxRow, columns: cols, seat_classes }, seatClasses, totalSeats: maxRow * cols.length }
        }
        if (mode === 'TRAIN') {
            const coaches = trainCoaches.map(c => ({ coach_no: c.coachNo, class: c.seatClass, seats: Number(c.seats) || 72, price: Number(c.price) || undefined }))
            const seatClasses = {}
            for (const c of trainCoaches) { if (c.seatClass && c.price) seatClasses[c.seatClass] = Number(c.price) }
            return { seatLayout: { coaches }, seatClasses, totalSeats: trainCoaches.reduce((s, c) => s + (Number(c.seats) || 0), 0) }
        }
        if (mode === 'BUS') {
            const cols = busCols.split(',').map(s => s.trim()).filter(Boolean)
            return { seatLayout: { rows: Number(busRows) || 12, columns: cols }, seatClasses: busPrice ? { Standard: Number(busPrice) } : null, totalSeats: (Number(busRows) || 12) * cols.length }
        }
    }

    const submit = async e => {
        e.preventDefault(); setLoading(true)
        try {
            const { seatLayout, seatClasses, totalSeats } = buildPayload()
            await adminApi.createVehicle({ ...form, capacity: Number(form.capacity), carrierId: form.carrierId, isActive: true, seatLayout, seatClasses, totalSeats: totalSeats || Number(form.capacity) })
            toast.success('Vehicle added'); load()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const modeOptions = [{ value: 'FLIGHT', label: '✈️ Flight' }, { value: 'TRAIN', label: '🚆 Train' }, { value: 'BUS', label: '🚌 Bus' }]
    const modeColors = { FLIGHT: 'text-sky-400', TRAIN: 'text-emerald-400', BUS: 'text-amber-400' }

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
                <SectionCard title="Add Vehicle" subtitle="Register a new transport vehicle">
                    <form onSubmit={submit} className="space-y-4">
                        <FieldGroup label="Assigned Carrier">
                            <AdminSelect options={carriers.map(c => ({ value: c.id, label: c.name }))} value={form.carrierId} onChange={set('carrierId')} />
                        </FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <FieldGroup label="Vehicle Name">
                                <AdminInput required value={form.name} onChange={set('name')} placeholder="IndiGo 6E-401" />
                            </FieldGroup>
                            <FieldGroup label="Vehicle No.">
                                <AdminInput value={form.vehicleNumber} onChange={set('vehicleNumber')} placeholder="6E-401" />
                            </FieldGroup>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FieldGroup label="Transport Mode">
                                <AdminSelect options={modeOptions} value={form.transportMode} onChange={set('transportMode')} />
                            </FieldGroup>
                            <FieldGroup label="Total Capacity">
                                <AdminInput type="number" min="1" value={form.capacity} onChange={set('capacity')} />
                            </FieldGroup>
                        </div>

                        {/* FLIGHT */}
                        {form.transportMode === 'FLIGHT' && (
                            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/6">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Seat Configuration</p>
                                <FieldGroup label="Columns (comma-separated)">
                                    <AdminInput value={flightCols} onChange={e => setFlightCols(e.target.value)} placeholder="A,B,C,D,E,F" />
                                </FieldGroup>
                                <div className="space-y-2">
                                    {flightCategories.map((cat, i) => (
                                        <div key={i} className="flex gap-2 items-center bg-gray-50 dark:bg-dark-700 rounded-xl p-2.5">
                                            <AdminInput className="flex-1 text-xs !py-1.5" value={cat.name} onChange={e => setFlightCat(i, 'name', e.target.value)} placeholder="Class" />
                                            <AdminInput className="w-14 text-xs !py-1.5" type="number" value={cat.rowStart} onChange={e => setFlightCat(i, 'rowStart', e.target.value)} placeholder="R↑" />
                                            <AdminInput className="w-14 text-xs !py-1.5" type="number" value={cat.rowEnd} onChange={e => setFlightCat(i, 'rowEnd', e.target.value)} placeholder="R↓" />
                                            <AdminInput className="w-20 text-xs !py-1.5" type="number" value={cat.price} onChange={e => setFlightCat(i, 'price', e.target.value)} placeholder="₹" />
                                            <button type="button" onClick={() => removeFlightCat(i)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addFlightCat} className="w-full py-1.5 text-xs font-semibold text-primary-500 border border-dashed border-primary-300 dark:border-primary-500/30 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors flex items-center justify-center gap-1.5">
                                        <Plus className="w-3.5 h-3.5" /> Add Class
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TRAIN */}
                        {form.transportMode === 'TRAIN' && (
                            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/6">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coaches & Classes</p>
                                <div className="grid grid-cols-4 gap-1 px-0.5">
                                    {['Coach', 'Class', 'Seats', '₹'].map(h => <p key={h} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{h}</p>)}
                                </div>
                                {trainCoaches.map((coach, i) => (
                                    <div key={i} className="grid grid-cols-4 gap-2 items-center bg-gray-50 dark:bg-dark-700 rounded-xl p-2.5">
                                        <AdminInput className="text-xs !py-1.5" value={coach.coachNo} onChange={e => setTrainCoach(i, 'coachNo', e.target.value)} placeholder="B1" />
                                        <AdminInput className="text-xs !py-1.5" value={coach.seatClass} onChange={e => setTrainCoach(i, 'seatClass', e.target.value)} placeholder="2AC" />
                                        <AdminInput className="text-xs !py-1.5" type="number" value={coach.seats} onChange={e => setTrainCoach(i, 'seats', e.target.value)} placeholder="72" />
                                        <div className="flex gap-1 items-center">
                                            <AdminInput className="text-xs !py-1.5 flex-1" type="number" value={coach.price} onChange={e => setTrainCoach(i, 'price', e.target.value)} placeholder="600" />
                                            <button type="button" onClick={() => removeTrainCoach(i)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addTrainCoach} className="w-full py-1.5 text-xs font-semibold text-primary-500 border border-dashed border-primary-300 dark:border-primary-500/30 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-colors flex items-center justify-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Coach
                                </button>
                            </div>
                        )}

                        {/* BUS */}
                        {form.transportMode === 'BUS' && (
                            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/6">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bus Layout</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <FieldGroup label="Rows"><AdminInput type="number" value={busRows} onChange={e => setBusRows(e.target.value)} placeholder="12" /></FieldGroup>
                                    <FieldGroup label="Columns"><AdminInput value={busCols} onChange={e => setBusCols(e.target.value)} placeholder="A,B,C,D" /></FieldGroup>
                                    <FieldGroup label="Price (₹)"><AdminInput type="number" value={busPrice} onChange={e => setBusPrice(e.target.value)} placeholder="500" /></FieldGroup>
                                </div>
                            </div>
                        )}

                        <SubmitBtn loading={loading} label="Add Vehicle" />
                    </form>
                </SectionCard>
            </div>

            <div className="lg:col-span-3">
                <SectionCard
                    title={`Vehicles (${vehicles.length})`}
                    subtitle="All registered vehicles"
                    action={<button onClick={load} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>}
                >
                    {vehicles.length === 0 ? <EmptyState message="No vehicles yet." /> :
                        vehicles.map(v => {
                            const classes = v.seatClasses ? Object.entries(v.seatClasses) : []
                            return (
                                <RecordRow
                                    key={v.id}
                                    primary={v.name}
                                    secondary={`${v.transportMode} · ${v.carrier?.name || '—'} · ${v.capacity} seats`}
                                    extra={classes.length > 0 && (
                                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                            {classes.map(([cls, price]) => (
                                                <span key={cls} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/25">
                                                    {cls} · ₹{Number(price).toLocaleString('en-IN')}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                />
                            )
                        })
                    }
                </SectionCard>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   TAB: STATIONS
═══════════════════════════════════════════════════════ */
function StationsTab() {
    const [stations, setStations] = useState([])
    const [form, setForm] = useState({ name: '', city: '', state: '', country: 'India', type: 'AIRPORT', latitude: '', longitude: '' })
    const [loading, setLoading] = useState(false)
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
    const load = () => adminApi.getStations().then(r => setStations(Array.isArray(r.data) ? r.data : [])).catch(() => {})
    useEffect(() => { load() }, [])

    const submit = async e => {
        e.preventDefault(); setLoading(true)
        try {
            await adminApi.createStation({ ...form, latitude: Number(form.latitude), longitude: Number(form.longitude), isActive: true })
            toast.success('Station added'); load()
            setForm({ name: '', city: '', state: '', country: 'India', type: 'AIRPORT', latitude: '', longitude: '' })
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const typeColors = { AIRPORT: 'text-sky-500 bg-sky-50 dark:bg-sky-500/10', TRAIN_STATION: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', BUS_TERMINAL: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' }

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
                <SectionCard title="Add Station" subtitle="Add an airport, train station or bus terminal">
                    <form onSubmit={submit} className="space-y-4">
                        <FieldGroup label="Station Name">
                            <AdminInput required value={form.name} onChange={set('name')} placeholder="SVPI International Airport" />
                        </FieldGroup>
                        <FieldGroup label="Type">
                            <AdminSelect value={form.type} onChange={set('type')} options={[{ value: 'AIRPORT', label: '✈️ Airport' }, { value: 'TRAIN_STATION', label: '🚉 Train Station' }, { value: 'BUS_TERMINAL', label: '🚌 Bus Terminal' }]} />
                        </FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <FieldGroup label="City"><AdminInput required value={form.city} onChange={set('city')} placeholder="Ahmedabad" /></FieldGroup>
                            <FieldGroup label="State"><AdminInput value={form.state} onChange={set('state')} placeholder="Gujarat" /></FieldGroup>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FieldGroup label="Latitude"><AdminInput type="number" step="any" required value={form.latitude} onChange={set('latitude')} placeholder="23.0727" /></FieldGroup>
                            <FieldGroup label="Longitude"><AdminInput type="number" step="any" required value={form.longitude} onChange={set('longitude')} placeholder="72.6347" /></FieldGroup>
                        </div>
                        <SubmitBtn loading={loading} label="Add Station" />
                    </form>
                </SectionCard>
            </div>

            <div className="lg:col-span-3">
                <SectionCard
                    title={`Stations (${stations.length})`}
                    subtitle="All registered stations & terminals"
                    action={<button onClick={load} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>}
                >
                    <div className="max-h-[480px] overflow-y-auto -mr-2 pr-2 space-y-0">
                        {stations.length === 0 ? <EmptyState message="No stations yet." /> :
                            stations.map(s => (
                                <RecordRow key={s.id} primary={`${s.city} – ${s.name}`}
                                    secondary={`${s.state}, ${s.country}`}
                                    extra={
                                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[s.type] || 'text-gray-500'}`}>
                                            {s.type.replace('_', ' ')}
                                        </span>
                                    }
                                />
                            ))
                        }
                    </div>
                </SectionCard>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   TAB: TRIPS
═══════════════════════════════════════════════════════ */
function TripsTab() {
    const [trips, setTrips] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [stations, setStations] = useState([])
    const [selectedMode, setSelectedMode] = useState('FLIGHT')
    const [tripFilter, setTripFilter] = useState('ALL')
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ vehicleId: '', originStationId: '', destinationStationId: '', departureTime: '', arrivalTime: '', distance: '', price: '', availableSeats: '' })
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    const MODE_CONFIG = {
        FLIGHT: { label: 'Flight', icon: <Plane className="w-4 h-4" />, stationType: 'AIRPORT', badge: 'badge-flight', color: 'sky' },
        TRAIN:  { label: 'Train',  icon: <Train className="w-4 h-4" />, stationType: 'TRAIN_STATION', badge: 'badge-train', color: 'emerald' },
        BUS:    { label: 'Bus',    icon: <Bus className="w-4 h-4" />, stationType: 'BUS_TERMINAL', badge: 'badge-bus', color: 'amber' },
    }

    const load = () => Promise.all([adminApi.getTrips(), adminApi.getVehicles(), adminApi.getStations()])
        .then(([t, v, s]) => { setTrips(Array.isArray(t.data) ? t.data : []); setVehicles(Array.isArray(v.data) ? v.data : []); setStations(Array.isArray(s.data) ? s.data : []) })
        .catch(() => {})
    useEffect(() => { load() }, [])

    const filteredVehicles = vehicles.filter(v => v.transportMode === selectedMode)
    const filteredStations = stations.filter(s => s.type === MODE_CONFIG[selectedMode].stationType)
    const selectedVehicle = vehicles.find(v => String(v.id) === String(form.vehicleId))
    const vehicleHasClasses = selectedVehicle?.seatClasses && Object.keys(selectedVehicle.seatClasses).length > 0

    const autoDerive = vehicleId => {
        const v = vehicles.find(v => String(v.id) === String(vehicleId))
        if (!v) return {}
        const prices = v.seatClasses ? Object.values(v.seatClasses).map(Number).filter(p => p > 0) : []
        return { price: prices.length ? String(Math.min(...prices)) : '', availableSeats: String(v.totalSeats || v.capacity || '') }
    }

    useEffect(() => {
        const fv = filteredVehicles[0]; const fs = filteredStations[0]
        const derived = fv ? autoDerive(fv.id) : {}
        setForm(f => ({ ...f, vehicleId: fv ? String(fv.id) : '', originStationId: fs ? String(fs.id) : '', destinationStationId: fs ? String(fs.id) : '', ...derived }))
    }, [selectedMode, vehicles, stations])

    const submit = async e => {
        e.preventDefault(); setLoading(true)
        try {
            await adminApi.createTrip({ ...form, price: Number(form.price), distance: Number(form.distance), availableSeats: Number(form.availableSeats), isActive: true })
            toast.success('Trip added!'); load()
            setForm(f => ({ ...f, departureTime: '', arrivalTime: '', distance: '' }))
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const displayedTrips = tripFilter === 'ALL' ? trips : trips.filter(t => t.transportMode === tripFilter)
    const modeTabColors = { FLIGHT: 'text-sky-600 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20', TRAIN: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20', BUS: 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20' }

    return (
        <div className="space-y-5">
            {/* Mode selector */}
            <div className="flex gap-2">
                {Object.entries(MODE_CONFIG).map(([mode, cfg]) => (
                    <button key={mode} type="button" onClick={() => setSelectedMode(mode)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${selectedMode === mode ? modeTabColors[mode] + ' shadow-sm' : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-white/8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                        {cfg.icon} {cfg.label}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <SectionCard title={`Add ${MODE_CONFIG[selectedMode].label} Trip`} subtitle="Schedule a new trip">
                        <form onSubmit={submit} className="space-y-4">
                            <FieldGroup label="Vehicle">
                                <select value={form.vehicleId} onChange={e => { const d = autoDerive(e.target.value); setForm(f => ({ ...f, vehicleId: e.target.value, ...d })) }} className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer" required>
                                    {filteredVehicles.length === 0 && <option value="">— no {MODE_CONFIG[selectedMode].label.toLowerCase()} vehicles —</option>}
                                    {filteredVehicles.map(v => <option key={v.id} value={v.id}>{v.name} · {v.carrier?.name || '—'}</option>)}
                                </select>
                            </FieldGroup>

                            {vehicleHasClasses && selectedVehicle && (
                                <div className="rounded-xl bg-gray-50 dark:bg-dark-700 p-3 space-y-2">
                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class Pricing (from vehicle)</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(selectedVehicle.seatClasses).map(([cls, price]) => (
                                            <span key={cls} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-dark-600 border border-gray-200 dark:border-white/8 text-gray-700 dark:text-gray-200">
                                                {cls} <span className="text-primary-500">₹{Number(price).toLocaleString('en-IN')}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <FieldGroup label="Origin">
                                    <select value={form.originStationId} onChange={set('originStationId')} className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer" required>
                                        {filteredStations.length === 0 && <option value="">— none —</option>}
                                        {filteredStations.map(s => <option key={s.id} value={s.id}>{s.city} – {s.name}</option>)}
                                    </select>
                                </FieldGroup>
                                <FieldGroup label="Destination">
                                    <select value={form.destinationStationId} onChange={set('destinationStationId')} className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer" required>
                                        {filteredStations.length === 0 && <option value="">— none —</option>}
                                        {filteredStations.map(s => <option key={s.id} value={s.id}>{s.city} – {s.name}</option>)}
                                    </select>
                                </FieldGroup>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <FieldGroup label="Departure"><AdminInput type="datetime-local" required value={form.departureTime} onChange={set('departureTime')} /></FieldGroup>
                                <FieldGroup label="Arrival"><AdminInput type="datetime-local" required value={form.arrivalTime} onChange={set('arrivalTime')} /></FieldGroup>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <FieldGroup label={vehicleHasClasses ? 'Distance (km)' : 'Base Price (₹)'}>
                                    <AdminInput type="number" min="0" required value={vehicleHasClasses ? form.distance : form.price} onChange={vehicleHasClasses ? set('distance') : set('price')} placeholder={vehicleHasClasses ? '540' : '1200'} />
                                </FieldGroup>
                                <FieldGroup label={vehicleHasClasses ? 'Available Seats' : 'Distance (km)'}>
                                    <AdminInput type="number" min="0" required value={vehicleHasClasses ? form.availableSeats : form.distance} onChange={vehicleHasClasses ? set('availableSeats') : set('distance')} placeholder={vehicleHasClasses ? '180' : '540'} />
                                </FieldGroup>
                            </div>
                            {vehicleHasClasses && <FieldGroup label="Available Seats"><AdminInput type="number" min="1" value={form.availableSeats} onChange={set('availableSeats')} placeholder={String(selectedVehicle?.totalSeats || '')} /></FieldGroup>}

                            <SubmitBtn loading={loading} label={`Add ${MODE_CONFIG[selectedMode].label} Trip`} />
                        </form>
                    </SectionCard>
                </div>

                <div className="lg:col-span-3">
                    <SectionCard
                        title={`Trips (${displayedTrips.length})`}
                        subtitle="Scheduled trips across all modes"
                        action={
                            <div className="flex gap-1 bg-gray-100 dark:bg-dark-700 p-1 rounded-lg border border-gray-200 dark:border-white/8">
                                {['ALL', 'FLIGHT', 'TRAIN', 'BUS'].map(f => (
                                    <button key={f} type="button" onClick={() => setTripFilter(f)}
                                        className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${tripFilter === f ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}>
                                        {f === 'ALL' ? 'All' : MODE_CONFIG[f].label}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <div className="max-h-[520px] overflow-y-auto -mr-2 pr-2">
                            {displayedTrips.length === 0 ? <EmptyState message="No trips yet." /> :
                                displayedTrips.map(t => {
                                    const cfg = MODE_CONFIG[t.transportMode] || MODE_CONFIG.FLIGHT
                                    return (
                                        <RecordRow
                                            key={t.id}
                                            primary={`${t.originStation?.city} → ${t.destinationStation?.city}`}
                                            secondary={`₹${Number(t.price).toLocaleString('en-IN')}  ·  ${t.availableSeats} seats  ·  ${new Date(t.departureTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}`}
                                            extra={<span className={`inline-block mt-1 ${cfg.badge}`}>{cfg.label}</span>}
                                            onDelete={() => adminApi.deleteTrip(t.id).then(load).catch(() => toast.error('Failed'))}
                                        />
                                    )
                                })
                            }
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   TAB: BOOKINGS
═══════════════════════════════════════════════════════ */
function BookingsTab() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        adminApi.getAllBookings().then(r => setBookings(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
    }, [])

    const statusColor = s => ({ CONFIRMED: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10', PAID: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10', CANCELLED: 'text-red-500 bg-red-50 dark:bg-red-500/10', PENDING: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' }[s] || 'text-gray-500 bg-gray-100 dark:bg-dark-600')

    return (
        <SectionCard title={`All Bookings (${bookings.length})`} subtitle="Platform-wide booking records">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-white/6">
                            {['ID', 'Customer', 'Status', 'Total Fare', 'Booked On'].map(h => (
                                <th key={h} className="pb-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pr-6">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="py-12 text-center text-gray-400 dark:text-gray-500"><div className="flex justify-center"><div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div></td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-gray-400 dark:text-gray-500">No bookings yet</td></tr>
                        ) : bookings.map(b => (
                            <tr key={b.id} className="border-b border-gray-50 dark:border-white/4 hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                                <td className="py-3.5 pr-6 font-mono text-xs text-gray-500 dark:text-gray-400">#{b.id}</td>
                                <td className="py-3.5 pr-6">
                                    <p className="font-semibold text-gray-900 dark:text-white">{b.user?.name}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{b.user?.email}</p>
                                </td>
                                <td className="py-3.5 pr-6">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(b.status)}`}>{b.status}</span>
                                </td>
                                <td className="py-3.5 pr-6 font-bold text-primary-600 dark:text-primary-400">₹{Number(b.totalPrice).toLocaleString('en-IN')}</td>
                                <td className="py-3.5 text-xs text-gray-500 dark:text-gray-400">{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    )
}

/* ═══════════════════════════════════════════════════════
   TAB: CONFIG
═══════════════════════════════════════════════════════ */
function ConfigTab() {
    const [configs, setConfigs] = useState([])
    const [form, setForm] = useState({ configKey: '', configValue: '', description: '' })
    const [loading, setLoading] = useState(false)
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
    const load = () => adminApi.getConfigs().then(r => setConfigs(r.data)).catch(() => {})
    useEffect(() => { load() }, [])

    const submit = async e => {
        e.preventDefault(); setLoading(true)
        try { await adminApi.upsertConfig(form); toast.success('Config saved'); load(); setForm({ configKey: '', configValue: '', description: '' }) }
        catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    return (
        <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
                <SectionCard title="Set Configuration" subtitle="Add or update a platform config value">
                    <form onSubmit={submit} className="space-y-4">
                        <FieldGroup label="Config Key" helper="Use snake_case (e.g. minimum_layover_minutes)">
                            <AdminInput required value={form.configKey} onChange={set('configKey')} placeholder="minimum_layover_minutes" />
                        </FieldGroup>
                        <FieldGroup label="Value">
                            <AdminInput required value={form.configValue} onChange={set('configValue')} placeholder="120" />
                        </FieldGroup>
                        <FieldGroup label="Description">
                            <AdminInput value={form.description} onChange={set('description')} placeholder="Minimum layover time in minutes" />
                        </FieldGroup>
                        <SubmitBtn loading={loading} label="Save Config" icon={CheckCircle2} />
                    </form>
                </SectionCard>
            </div>
            <div className="lg:col-span-3">
                <SectionCard
                    title={`Active Config (${configs.length})`}
                    subtitle="Current platform configuration"
                    action={<button onClick={load} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>}
                >
                    {configs.length === 0 ? <EmptyState message="No config set yet." /> :
                        configs.map(c => (
                            <div key={c.configKey} className="flex items-start justify-between py-3.5 border-b border-gray-100 dark:border-white/5 last:border-0 gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 truncate">{c.configKey}</p>
                                    {c.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.description}</p>}
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">{c.configValue}</span>
                            </div>
                        ))
                    }
                </SectionCard>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   MAIN: ADMIN PAGE
═══════════════════════════════════════════════════════ */
export default function AdminPage() {
    const [tab, setTab] = useState('carriers')

    const tabContent = {
        carriers: <CarriersTab />,
        vehicles: <VehiclesTab />,
        stations: <StationsTab />,
        trips:    <TripsTab />,
        bookings: <BookingsTab />,
        config:   <ConfigTab />,
    }

    const currentTab = TABS.find(t => t.id === tab)

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* ── PAGE HEADER ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 bg-violet-500/15 dark:bg-violet-500/20 border border-violet-500/25 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your Tripline platform</p>
                        </div>
                    </div>
                </div>

                {/* ── TAB BAR ── */}
                <div className="flex gap-1 flex-wrap mb-7 bg-white dark:bg-dark-800 p-1.5 rounded-2xl border border-gray-200 dark:border-white/8 shadow-sm dark:shadow-lg w-fit">
                    {TABS.map(t => {
                        const Icon = t.icon
                        const active = tab === t.id
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${active
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? 'text-white' : t.color}`} />
                                <span className="hidden sm:inline">{t.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* ── BREADCRUMB ── */}
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>/</span>
                    {currentTab && <><currentTab.icon className={`w-3.5 h-3.5 ${currentTab.color}`} /><span className="text-gray-700 dark:text-gray-300">{currentTab.label}</span></>}
                </div>

                {/* ── TAB CONTENT ── */}
                <div className="animate-fade-in">
                    {tabContent[tab]}
                </div>
            </div>
        </div>
    )
}
