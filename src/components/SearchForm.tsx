'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, DollarSign, Calendar } from 'lucide-react'

const SUGGESTIONS = ['Colombo', 'Nugegoda', 'Kandy', 'Galle', 'Negombo', 'Dehiwala']
const PROPERTY_TYPES = ['House', 'Apartment', 'Land', 'Commercial', 'Annex', 'Villa']

export default function SearchForm() {
  const router = useRouter()
  const [purpose, setPurpose] = useState<'SALE' | 'RENT' | 'LEASE'>('SALE')
  const [location, setLocation] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [propertyType, setPropertyType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('purpose', purpose)
    if (location) params.set('city', location)
    if (propertyType) params.set('type', propertyType)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (bedrooms) params.set('bedrooms', bedrooms)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Purpose Tabs */}
      <div className="flex gap-2 mb-3 justify-center md:justify-start">
        {(['SALE', 'RENT', 'LEASE'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPurpose(p)}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
              purpose === p
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-card text-card-foreground hover:bg-secondary border border-border'
            }`}
          >
            {p === 'SALE' ? 'BUY' : p}
          </button>
        ))}
      </div>

      {/* Main Search Panel */}
      <form
        onSubmit={handleSearch}
        className="glass-card border border-border/80 rounded-2xl p-4 md:p-6 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* Location Select */}
        <div className="relative flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Location
          </label>
          <input
            type="text"
            placeholder="City or District..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {showSuggestions && location && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg z-25 overflow-hidden">
              {SUGGESTIONS.filter((s) => s.toLowerCase().includes(location.toLowerCase())).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setLocation(item)
                    setShowSuggestions(false)
                  }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-primary" /> Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">Any Type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price / Budget */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-primary" /> Max Budget
          </label>
          <input
            type="number"
            placeholder="Max price LKR..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Search Submit */}
        <div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/25 cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Properties
          </button>
        </div>
      </form>
    </div>
  )
}
