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

    const load = () => adminApi.getCarriers().then(r => setCarriers(Array.isArray(r.data) ? r.data : [])).catch(() => { })
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
    const [form, setForm] = useState({
        name: '', vehicleNumber: '', transportMode: 'FLIGHT',
        capacity: 180, carrierId: '',
    })
    const [loading, setLoading] = useState(false)

    // FLIGHT: seat categories [ { name, rowStart, rowEnd, price } ]
    const [flightCategories, setFlightCategories] = useState([
        { name: 'Business', rowStart: '1', rowEnd: '5', price: '8000' },
        { name: 'Economy', rowStart: '6', rowEnd: '30', price: '2500' },
    ])
    const [flightCols, setFlightCols] = useState('A,B,C,D,E,F')

    // TRAIN: coaches [ { coachNo, seatClass, seats, price } ]
    const [trainCoaches, setTrainCoaches] = useState([
        { coachNo: 'A1', seatClass: '1AC', seats: '24', price: '3500' },
        { coachNo: 'B1', seatClass: '2AC', seats: '48', price: '2000' },
        { coachNo: 'S1', seatClass: 'Sleeper', seats: '72', price: '600' },
    ])

    // BUS: simple rows + cols
    const [busRows, setBusRows] = useState('12')
    const [busCols, setBusCols] = useState('A,B,C,D')
    const [busPrice, setBusPrice] = useState('')

    const load = () => Promise.all([adminApi.getVehicles(), adminApi.getCarriers()])
        .then(([v, c]) => {
            const vArr = Array.isArray(v.data) ? v.data : []
            const cArr = Array.isArray(c.data) ? c.data : []
            setVehicles(vArr); setCarriers(cArr)
            if (cArr[0]) setForm(f => ({ ...f, carrierId: cArr[0].id }))
        }).catch(() => { })
    useEffect(() => { load() }, [])

    /* ----- Flight category helpers ----- */
    const addFlightCat = () => setFlightCategories(fc => [...fc, { name: '', rowStart: '', rowEnd: '', price: '' }])
    const removeFlightCat = (i) => setFlightCategories(fc => fc.filter((_, idx) => idx !== i))
    const setFlightCat = (i, key, val) => setFlightCategories(fc => fc.map((c, idx) => idx === i ? { ...c, [key]: val } : c))

    /* ----- Train coach helpers ----- */
    const addTrainCoach = () => setTrainCoaches(tc => [...tc, { coachNo: '', seatClass: '', seats: '72', price: '' }])
    const removeTrainCoach = (i) => setTrainCoaches(tc => tc.filter((_, idx) => idx !== i))
    const setTrainCoach = (i, key, val) => setTrainCoaches(tc => tc.map((c, idx) => idx === i ? { ...c, [key]: val } : c))

    /* ----- Build seatLayout + seatClasses JSON for backend ----- */
    const buildPayload = () => {
        const mode = form.transportMode
        let seatLayout = null, seatClasses = null, totalSeats = null

        if (mode === 'FLIGHT') {
            const cols = flightCols.split(',').map(s => s.trim()).filter(Boolean)
            const seat_classes = {}
            for (const cat of flightCategories) {
                if (cat.name && cat.rowStart && cat.rowEnd) {
                    seat_classes[cat.name] = { rows: `${cat.rowStart}-${cat.rowEnd}` }
                    if (cat.price) seat_classes[cat.name].price = Number(cat.price)
                }
            }
            const lastCat = flightCategories[flightCategories.length - 1]
            const maxRow = lastCat ? Number(lastCat.rowEnd) || 30 : 30
            seatLayout = { rows: maxRow, columns: cols, seat_classes }
            seatClasses = {}
            for (const cat of flightCategories) {
                if (cat.name && cat.price) seatClasses[cat.name] = Number(cat.price)
            }
            totalSeats = maxRow * cols.length
        }

        if (mode === 'TRAIN') {
            const coaches = trainCoaches.map(c => ({
                coach_no: c.coachNo,
                class: c.seatClass,
                seats: Number(c.seats) || 72,
                price: Number(c.price) || undefined,
            }))
            seatLayout = { coaches }
            seatClasses = {}
            for (const c of trainCoaches) {
                if (c.seatClass && c.price) seatClasses[c.seatClass] = Number(c.price)
            }
            totalSeats = trainCoaches.reduce((sum, c) => sum + (Number(c.seats) || 0), 0)
        }

        if (mode === 'BUS') {
            const cols = busCols.split(',').map(s => s.trim()).filter(Boolean)
            seatLayout = { rows: Number(busRows) || 12, columns: cols }
            seatClasses = busPrice ? { 'Standard': Number(busPrice) } : null
            totalSeats = (Number(busRows) || 12) * cols.length
        }

        return { seatLayout, seatClasses, totalSeats }
    }

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            const { seatLayout, seatClasses, totalSeats } = buildPayload()
            await adminApi.createVehicle({
                name: form.name, vehicleNumber: form.vehicleNumber,
                transportMode: form.transportMode, capacity: Number(form.capacity),
                carrierId: form.carrierId, isActive: true,
                seatLayout, seatClasses,
                totalSeats: totalSeats || Number(form.capacity)
            })
            toast.success('Vehicle added'); load()
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const modeOptions = [{ value: 'FLIGHT', label: '✈️ Flight' }, { value: 'TRAIN', label: '🚆 Train' }, { value: 'BUS', label: '🚌 Bus' }]

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={submit} className="glass-card p-5 space-y-5">
                <h3 className="text-white font-semibold">Add Vehicle</h3>

                {/* Basic Info */}
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
                    <Field label="Total Capacity"><Input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></Field>
                </div>

                {/* ── FLIGHT seat categories ── */}
                {form.transportMode === 'FLIGHT' && (
                    <div className="space-y-3">
                        <Field label="Seat Columns (comma-separated)">
                            <Input value={flightCols} onChange={e => setFlightCols(e.target.value)} placeholder="A,B,C,D,E,F" />
                        </Field>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Seat Classes</p>
                            <button type="button" onClick={addFlightCat} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Class</button>
                        </div>
                        {flightCategories.map((cat, i) => (
                            <div key={i} className="grid grid-cols-5 gap-2 items-center bg-white/5 rounded-xl p-3">
                                <div className="col-span-2">
                                    <input className="input-field text-xs" value={cat.name} onChange={e => setFlightCat(i, 'name', e.target.value)} placeholder="Class name (e.g. Business)" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <input className="input-field text-xs w-full" type="number" value={cat.rowStart} onChange={e => setFlightCat(i, 'rowStart', e.target.value)} placeholder="Row from" />
                                    <span className="text-gray-600 text-xs">–</span>
                                    <input className="input-field text-xs w-full" type="number" value={cat.rowEnd} onChange={e => setFlightCat(i, 'rowEnd', e.target.value)} placeholder="Row to" />
                                </div>
                                <div>
                                    <input className="input-field text-xs" type="number" value={cat.price} onChange={e => setFlightCat(i, 'price', e.target.value)} placeholder="₹ Price" />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => removeFlightCat(i)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        ))}
                        <div className="text-xs text-gray-600 bg-white/3 rounded-lg p-2.5 space-y-0.5">
                            <p className="text-gray-400 font-semibold mb-1">Preview JSON</p>
                            <code className="text-primary-400 text-[10px] break-all">
                                {JSON.stringify({ rows: Number(flightCategories[flightCategories.length - 1]?.rowEnd || 30), columns: flightCols.split(',').map(s => s.trim()) }, null, 0)}
                            </code>
                        </div>
                    </div>
                )}

                {/* ── TRAIN coaches ── */}
                {form.transportMode === 'TRAIN' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Coaches & Classes</p>
                            <button type="button" onClick={addTrainCoach} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Coach</button>
                        </div>
                        <div className="grid grid-cols-4 gap-1 px-1">
                            {['Coach No.', 'Class', 'Seats', '₹ Price'].map(h => (
                                <p key={h} className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">{h}</p>
                            ))}
                        </div>
                        {trainCoaches.map((coach, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 items-center bg-white/5 rounded-xl p-2.5">
                                <input className="input-field text-xs" value={coach.coachNo} onChange={e => setTrainCoach(i, 'coachNo', e.target.value)} placeholder="B1" />
                                <input className="input-field text-xs" value={coach.seatClass} onChange={e => setTrainCoach(i, 'seatClass', e.target.value)} placeholder="3AC / Sleeper" />
                                <input className="input-field text-xs" type="number" value={coach.seats} onChange={e => setTrainCoach(i, 'seats', e.target.value)} placeholder="72" />
                                <div className="flex gap-1 items-center">
                                    <input className="input-field text-xs flex-1" type="number" value={coach.price} onChange={e => setTrainCoach(i, 'price', e.target.value)} placeholder="600" />
                                    <button type="button" onClick={() => removeTrainCoach(i)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-gray-600">Total: {trainCoaches.reduce((s, c) => s + Number(c.seats || 0), 0)} seats across {trainCoaches.length} coach(es)</p>
                    </div>
                )}

                {/* ── BUS layout ── */}
                {form.transportMode === 'BUS' && (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Bus Layout</p>
                        <div className="grid grid-cols-3 gap-3">
                            <Field label="Rows"><Input type="number" value={busRows} onChange={e => setBusRows(e.target.value)} placeholder="12" /></Field>
                            <Field label="Columns (e.g. A,B,C,D)"><Input value={busCols} onChange={e => setBusCols(e.target.value)} placeholder="A,B,C,D" /></Field>
                            <Field label="Seat Price (₹)"><Input type="number" value={busPrice} onChange={e => setBusPrice(e.target.value)} placeholder="500" /></Field>
                        </div>
                        <p className="text-xs text-gray-600">{(Number(busRows) || 0) * busCols.split(',').filter(Boolean).length} total seats</p>
                    </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Vehicle
                </button>
            </form>
            <div className="space-y-3">
                <h3 className="text-white font-semibold">Existing Vehicles ({vehicles.length})</h3>
                {vehicles.map(v => {
                    const classes = v.seatClasses ? Object.keys(v.seatClasses) : []
                    return (
                        <div key={v.id} className="flex items-start justify-between p-3 bg-dark-700 rounded-xl">
                            <div>
                                <p className="text-white text-sm font-medium">{v.name}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{v.transportMode} • {v.carrier?.name} • {v.capacity} seats</p>
                                {classes.length > 0 && (
                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                        {classes.map(cls => (
                                            <span key={cls} className="text-[10px] px-1.5 py-0.5 bg-primary-500/15 text-primary-400 rounded border border-primary-500/25 font-semibold">
                                                {cls} — ₹{Number(v.seatClasses[cls]).toLocaleString('en-IN')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                {vehicles.length === 0 && <p className="text-gray-600 text-sm">No vehicles yet.</p>}
            </div>
        </div>
    )
}


function StationsTab() {
    const [stations, setStations] = useState([])
    const [form, setForm] = useState({ name: '', city: '', state: '', country: 'India', type: 'AIRPORT', latitude: '', longitude: '' })
    const [loading, setLoading] = useState(false)

    const load = () => adminApi.getStations().then(r => setStations(Array.isArray(r.data) ? r.data : [])).catch(() => { })
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
    const [selectedMode, setSelectedMode] = useState('FLIGHT')
    const [form, setForm] = useState({
        vehicleId: '', originStationId: '', destinationStationId: '',
        departureTime: '', arrivalTime: '', distance: '',
        // price and availableSeats will be auto-derived from vehicle
        price: '', availableSeats: ''
    })
    const [loading, setLoading] = useState(false)
    const [tripFilter, setTripFilter] = useState('ALL')

    const MODE_CONFIG = {
        FLIGHT: { label: 'Flight', icon: <Plane className="w-4 h-4" />, stationType: 'AIRPORT', color: 'sky', badge: 'badge-flight' },
        TRAIN: { label: 'Train', icon: <Train className="w-4 h-4" />, stationType: 'TRAIN_STATION', color: 'emerald', badge: 'badge-train' },
        BUS: { label: 'Bus', icon: <Bus className="w-4 h-4" />, stationType: 'BUS_TERMINAL', color: 'amber', badge: 'badge-bus' },
    }

    const load = () => Promise.all([adminApi.getTrips(), adminApi.getVehicles(), adminApi.getStations()])
        .then(([t, v, s]) => {
            setTrips(Array.isArray(t.data) ? t.data : []); setVehicles(Array.isArray(v.data) ? v.data : []); setStations(Array.isArray(s.data) ? s.data : [])
        }).catch(() => { })
    useEffect(() => { load() }, [])

    // Filter vehicles and stations based on selected mode
    const filteredVehicles = vehicles.filter(v => v.transportMode === selectedMode)
    const filteredStations = stations.filter(s => s.type === MODE_CONFIG[selectedMode].stationType)

    // Get the currently selected vehicle object
    const selectedVehicle = vehicles.find(v => String(v.id) === String(form.vehicleId))
    const vehicleHasClasses = selectedVehicle?.seatClasses && Object.keys(selectedVehicle.seatClasses).length > 0

    // Auto-derive: lowest class price as base trip price, totalSeats from vehicle
    const autoDeriveFromVehicle = (vehicleId) => {
        const v = vehicles.find(v => String(v.id) === String(vehicleId))
        if (!v) return {}
        let autoPrice = ''
        if (v.seatClasses && Object.keys(v.seatClasses).length > 0) {
            const prices = Object.values(v.seatClasses).map(Number).filter(p => p > 0)
            if (prices.length > 0) autoPrice = Math.min(...prices)
        }
        const autoSeats = v.totalSeats || v.capacity || ''
        return { price: String(autoPrice), availableSeats: String(autoSeats) }
    }

    // Auto-select first vehicle/station when mode changes
    useEffect(() => {
        const firstVehicle = filteredVehicles[0]
        const firstStation = filteredStations[0]
        const derived = firstVehicle ? autoDeriveFromVehicle(firstVehicle.id) : {}
        setForm(f => ({
            ...f,
            vehicleId: firstVehicle ? String(firstVehicle.id) : '',
            originStationId: firstStation ? String(firstStation.id) : '',
            destinationStationId: firstStation ? String(firstStation.id) : '',
            ...derived,
        }))
    }, [selectedMode, vehicles, stations])

    const submit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            await adminApi.createTrip({ ...form, price: Number(form.price), distance: Number(form.distance), availableSeats: Number(form.availableSeats), isActive: true })
            toast.success('Trip added!'); load()
            setForm(f => ({ ...f, departureTime: '', arrivalTime: '', distance: '' }))
        } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
        finally { setLoading(false) }
    }

    const dateInputProps = { type: 'datetime-local', className: 'input-field' }
    const currentCfg = MODE_CONFIG[selectedMode]

    // Filter trips for the list
    const displayedTrips = tripFilter === 'ALL' ? trips : trips.filter(t => t.transportMode === tripFilter)

    return (
        <div className="space-y-6">
            {/* ── Transport Mode Selector ── */}
            <div className="glass-card p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Select Transport Mode</p>
                <div className="flex gap-2">
                    {Object.entries(MODE_CONFIG).map(([mode, cfg]) => {
                        const isActive = selectedMode === mode
                        const colorMap = { sky: 'bg-sky-500/20 border-sky-500/40 text-sky-400 shadow-sky-500/20', emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20', amber: 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20' }
                        return (
                            <button key={mode} type="button" onClick={() => setSelectedMode(mode)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${isActive
                                    ? `${colorMap[cfg.color]} shadow-lg`
                                    : 'bg-dark-700/50 border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'}`}>
                                {cfg.icon}
                                {cfg.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* ── Add Trip Form ── */}
                <form onSubmit={submit} className="glass-card p-6 space-y-5">
                    <div className="flex items-center gap-2">
                        <span className={`mode-icon-${currentCfg.color === 'sky' ? 'flight' : selectedMode.toLowerCase()}`}>{currentCfg.icon}</span>
                        <h3 className="text-white font-semibold text-lg">Add {currentCfg.label} Trip</h3>
                    </div>

                    {/* Section: Vehicle */}
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">Vehicle</p>
                        <Field label={`${currentCfg.label} Vehicle`}>
                            <select value={form.vehicleId} onChange={e => {
                                const derived = autoDeriveFromVehicle(e.target.value)
                                setForm({ ...form, vehicleId: e.target.value, ...derived })
                            }} className="input-field" required>
                                {filteredVehicles.length === 0 && <option value="">— No {currentCfg.label.toLowerCase()} vehicles —</option>}
                                {filteredVehicles.map(v => <option key={v.id} value={v.id}>{v.name} • {v.carrier?.name || 'Unknown Carrier'} • {v.capacity} seats</option>)}
                            </select>
                        </Field>

                        {/* Show class badges when vehicle has seat classes */}
                        {vehicleHasClasses && selectedVehicle && (
                            <div className="rounded-xl bg-white/5 border border-white/8 p-3 space-y-2">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Class-Based Pricing (from vehicle config)</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(selectedVehicle.seatClasses).map(([cls, price]) => (
                                        <div key={cls} className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/25 text-center">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cls}</span>
                                            <span className="text-sm font-bold text-primary-400">₹{Number(price).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-amber-400/70 flex items-center gap-1">
                                    <span>⚡</span> Seat-wise prices are set. Trip base price auto-set to lowest class price.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Section: Route */}
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">Route</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Origin">
                                <select value={form.originStationId} onChange={e => setForm({ ...form, originStationId: e.target.value })} className="input-field" required>
                                    {filteredStations.length === 0 && <option value="">— No {currentCfg.label.toLowerCase()} stations —</option>}
                                    {filteredStations.map(s => <option key={s.id} value={s.id}>{s.city} – {s.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Destination">
                                <select value={form.destinationStationId} onChange={e => setForm({ ...form, destinationStationId: e.target.value })} className="input-field" required>
                                    {filteredStations.length === 0 && <option value="">— No {currentCfg.label.toLowerCase()} stations —</option>}
                                    {filteredStations.map(s => <option key={s.id} value={s.id}>{s.city} – {s.name}</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>

                    {/* Section: Schedule */}
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">Schedule</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Departure"><input {...dateInputProps} required value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} /></Field>
                            <Field label="Arrival"><input {...dateInputProps} required value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} /></Field>
                        </div>
                    </div>

                    {/* Section: Distance + optional price override */}
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">
                            {vehicleHasClasses ? 'Distance' : 'Pricing & Capacity'}
                        </p>
                        <div className={`grid gap-3 ${vehicleHasClasses ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {!vehicleHasClasses && (
                                <Field label="Base Price (₹)">
                                    <Input type="number" min="0" required value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1200" />
                                </Field>
                            )}
                            <Field label="Distance (km)">
                                <Input type="number" min="0" required value={form.distance}
                                    onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="540" />
                            </Field>
                            {vehicleHasClasses ? (
                                <Field label={`Seats (from vehicle: ${selectedVehicle?.totalSeats || selectedVehicle?.capacity || '–'})`}>
                                    <Input type="number" min="1" value={form.availableSeats}
                                        onChange={e => setForm({ ...form, availableSeats: e.target.value })}
                                        placeholder={String(selectedVehicle?.totalSeats || selectedVehicle?.capacity || '')} />
                                </Field>
                            ) : (
                                <Field label="Available Seats">
                                    <Input type="number" min="1" required value={form.availableSeats}
                                        onChange={e => setForm({ ...form, availableSeats: e.target.value })} placeholder="180" />
                                </Field>
                            )}
                        </div>
                        {/* Hidden base price input when vehicle has classes (auto-set) */}
                        {vehicleHasClasses && (
                            <p className="text-[10px] text-gray-600">
                                Base trip price auto-set to ₹{Number(form.price).toLocaleString('en-IN')} (lowest class price). Actual seat prices are per-class.
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={loading || filteredVehicles.length === 0 || filteredStations.length === 0}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add {currentCfg.label} Trip
                    </button>

                    {(filteredVehicles.length === 0 || filteredStations.length === 0) && (
                        <p className="text-amber-400/80 text-xs text-center">
                            ⚠️ Please add {filteredVehicles.length === 0 ? `${currentCfg.label} vehicles` : ''}{filteredVehicles.length === 0 && filteredStations.length === 0 ? ' and ' : ''}{filteredStations.length === 0 ? `${currentCfg.label} stations` : ''} first.
                        </p>
                    )}
                </form>


                {/* ── Existing Trips List ── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Trips ({displayedTrips.length})</h3>
                        <div className="flex gap-1 bg-dark-800/60 p-1 rounded-lg border border-white/5">
                            {['ALL', 'FLIGHT', 'TRAIN', 'BUS'].map(f => (
                                <button key={f} type="button" onClick={() => setTripFilter(f)}
                                    className={`text-xs px-2.5 py-1 rounded-md transition-all ${tripFilter === f ? 'bg-primary-600 text-white font-semibold' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {f === 'ALL' ? 'All' : MODE_CONFIG[f].label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                        {displayedTrips.map(t => {
                            const cfg = MODE_CONFIG[t.transportMode] || MODE_CONFIG.FLIGHT
                            return (
                                <div key={t.id} className="flex items-center justify-between p-3.5 bg-dark-700 rounded-xl hover:bg-dark-600/80 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.transportMode === 'FLIGHT' ? 'bg-sky-500/15 text-sky-400' : t.transportMode === 'TRAIN' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                            {cfg.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{t.originStation?.city} → {t.destinationStation?.city}</p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className={cfg.badge}>{cfg.label}</span>
                                                <span className="text-gray-500 text-xs">₹{Number(t.price).toLocaleString('en-IN')}</span>
                                                <span className="text-gray-600 text-xs">•</span>
                                                <span className="text-gray-500 text-xs">{new Date(t.departureTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                                <span className="text-gray-600 text-xs">•</span>
                                                <span className="text-gray-500 text-xs">{t.availableSeats} seats</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => adminApi.deleteTrip(t.id).then(load).catch(() => toast.error('Failed'))}
                                        className="text-red-400/50 hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            )
                        })}
                        {displayedTrips.length === 0 && <p className="text-gray-600 text-sm text-center py-8">No {tripFilter === 'ALL' ? '' : MODE_CONFIG[tripFilter]?.label.toLowerCase() + ' '}trips yet.</p>}
                    </div>
                </div>
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
