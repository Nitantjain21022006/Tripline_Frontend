import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchApi } from '../api/axios'
import SearchBar from '../components/SearchBar'
import JourneyCard from '../components/JourneyCard'
import toast from 'react-hot-toast'
import { SlidersHorizontal, Plane, Train, Bus, AlertCircle } from 'lucide-react'

export default function SearchResultsPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useState(location.state?.searchParams || null)
    const [selectedRoute, setSelectedRoute] = useState(null)

    useEffect(() => {
        if (searchParams) doSearch(searchParams)
    }, [])

    const doSearch = async (params) => {
        setLoading(true)
        setRoutes([])
        setSelectedRoute(null)
        setSearchParams(params)
        try {
            const res = await searchApi.findRoutes(params)
            setRoutes(res.data)
            if (res.data.length === 0) toast('No routes found for this search. Try a different date or city.', { icon: '🔍' })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Search failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = (route) => {
        setSelectedRoute(route)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleBook = () => {
        if (!selectedRoute) { toast.error('Please select a route first'); return }
        navigate('/booking', { state: { route: selectedRoute, searchParams } })
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Search Bar */}
                <div className="mb-8 animate-slide-up">
                    <SearchBar initialValues={searchParams} onSearch={doSearch} loading={loading} />
                </div>

                {/* Results Header */}
                {!loading && routes.length > 0 && (
                    <div className="flex items-center justify-between mb-4 animate-fade-in">
                        <p className="text-gray-400 text-sm">
                            <span className="text-white font-semibold">{routes.length}</span> routes found
                            {searchParams && ` for ${searchParams.originCity} → ${searchParams.destinationCity}`}
                        </p>
                    </div>
                )}

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-5 animate-pulse">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <div className="h-6 w-40 bg-dark-600 rounded-lg" />
                                        <div className="h-4 w-28 bg-dark-600 rounded-lg" />
                                    </div>
                                    <div className="h-10 w-24 bg-dark-600 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Route Results */}
                {!loading && routes.length > 0 && (
                    <div className="space-y-4 animate-fade-in">
                        {routes.map((route, idx) => (
                            <JourneyCard
                                key={idx}
                                route={route}
                                selected={selectedRoute === route}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && routes.length === 0 && searchParams && (
                    <div className="text-center py-20 animate-fade-in">
                        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No routes found</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            No trips were found between <strong>{searchParams.originCity}</strong> and{' '}
                            <strong>{searchParams.destinationCity}</strong> on this date.
                            Try a different date or check that the cities have active stations.
                        </p>
                    </div>
                )}

                {/* Initial State */}
                {!loading && !searchParams && (
                    <div className="text-center py-20 text-gray-600">
                        Use the search bar above to find routes.
                    </div>
                )}

                {/* Sticky Book Button */}
                {selectedRoute && (
                    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4 animate-slide-up">
                        <div className="glass-card px-6 py-4 flex items-center gap-6 shadow-2xl shadow-black/50">
                            <div>
                                <p className="text-xs text-gray-500">Selected route total</p>
                                <p className="text-xl font-bold text-white">₹{Number(selectedRoute.totalPrice).toLocaleString('en-IN')}</p>
                            </div>
                            <button onClick={handleBook} className="btn-primary text-base px-8">
                                Continue to Booking →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
