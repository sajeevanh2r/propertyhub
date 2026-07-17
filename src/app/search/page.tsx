import Navbar from '@/components/Navbar'
import ListingCard from '@/components/ListingCard'
import { db } from '@/lib/db'
import { Search, MapPin, SlidersHorizontal, Map, Grid, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface SearchPageProps {
  searchParams: Promise<{
    city?: string
    purpose?: string
    type?: string
    maxPrice?: string
    bedrooms?: string
    id?: string
  }>
}

const MOCK_PROPERTIES = [
  {
    id: 'mock-1',
    title: 'Modern 3-Bedroom House in Nugegoda',
    price: 24500000,
    negotiable: true,
    propertyType: 'House',
    purpose: 'SALE',
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    city: 'Nugegoda',
    district: 'Colombo',
    premiumBadge: 'FEATURED',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  },
  {
    id: 'mock-2',
    title: 'Luxury Apartment in Colombo 3',
    price: 68000000,
    negotiable: false,
    propertyType: 'Apartment',
    purpose: 'SALE',
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    city: 'Colombo 03',
    district: 'Colombo',
    premiumBadge: 'TOP',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  },
  {
    id: 'mock-3',
    title: 'Spacious Commercial Building in Kandy Center',
    price: 180000000,
    negotiable: true,
    propertyType: 'Commercial',
    purpose: 'SALE',
    bedrooms: 0,
    bathrooms: 4,
    area: 4500,
    city: 'Kandy',
    district: 'Kandy',
    premiumBadge: 'URGENT',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  },
  {
    id: 'mock-4',
    title: 'Beachfront Villa for Lease in Galle',
    price: 450000,
    negotiable: true,
    propertyType: 'Villa',
    purpose: 'LEASE',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    city: 'Galle',
    district: 'Galle',
    premiumBadge: 'NONE',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  },
]

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const city = params.city || ''
  const purpose = params.purpose || ''
  const type = params.type || ''
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null
  const bedrooms = params.bedrooms ? parseInt(params.bedrooms, 10) : null
  const highlightId = params.id || null

  // Build Prisma filter clauses
  const whereClause: any = {
    status: 'LIVE',
  }

  if (city) {
    whereClause.city = {
      contains: city,
      mode: 'insensitive',
    }
  }
  if (purpose) {
    whereClause.purpose = purpose
  }
  if (type) {
    whereClause.propertyType = {
      contains: type,
      mode: 'insensitive',
    }
  }
  if (maxPrice !== null) {
    whereClause.price = {
      lte: maxPrice,
    }
  }
  if (bedrooms !== null) {
    whereClause.bedrooms = bedrooms
  }

  let listings = []
  let usingMock = false

  try {
    listings = await db.listing.findMany({
      where: whereClause,
      include: {
        media: {
          where: {
            type: 'IMAGE',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Fallback if DB is empty
    if (listings.length === 0) {
      listings = MOCK_PROPERTIES.filter((item) => {
        if (city && !item.city.toLowerCase().includes(city.toLowerCase())) return false
        if (purpose && item.purpose !== purpose) return false
        if (type && !item.propertyType.toLowerCase().includes(type.toLowerCase())) return false
        if (maxPrice !== null && item.price > maxPrice) return false
        if (bedrooms !== null && item.bedrooms !== bedrooms) return false
        return true
      })
      usingMock = true
    } else {
      // Map to template format
      listings = listings.map((l) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        negotiable: l.negotiable,
        propertyType: l.propertyType,
        purpose: l.purpose,
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        area: l.area,
        city: l.city,
        district: l.district,
        premiumBadge: l.premiumBadge,
        image: l.media[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      }))
    }
  } catch (error) {
    console.warn('Database error fetching search listings, using mock filter fallbacks...', error)
    // Filter Mock properties locally based on query params
    listings = MOCK_PROPERTIES.filter((item) => {
      if (city && !item.city.toLowerCase().includes(city.toLowerCase())) return false
      if (purpose && item.purpose !== purpose) return false
      if (type && !item.propertyType.toLowerCase().includes(type.toLowerCase())) return false
      if (maxPrice !== null && item.price > maxPrice) return false
      if (bedrooms !== null && item.bedrooms !== bedrooms) return false
      return true
    })
    usingMock = true
  }

  // If a specific property ID is selected (e.g. from chatbot link)
  if (highlightId) {
    const matched = MOCK_PROPERTIES.find((item) => item.id === highlightId)
    if (matched && !listings.some((l) => l.id === highlightId)) {
      listings = [matched, ...listings]
    }
  }

  const formatLKR = (value: number) => {
    if (value >= 10000000) return `LKR ${(value / 10000000).toFixed(1)} Crore`
    if (value >= 100000) return `LKR ${(value / 100000).toFixed(1)} Lakh`
    return `LKR ${value.toLocaleString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Navbar />

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Side: Filter Sidebar */}
        <aside className="w-full md:w-[300px] shrink-0 space-y-6">
          <div className="glass-card rounded-2xl border border-border/80 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Options
              </h2>
              <Link href="/search" className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Clear All
              </Link>
            </div>

            {/* Filter Form (Server-Redirect-based) */}
            <form action="/search" method="GET" className="space-y-4 text-xs">
              {/* Location Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> City / District
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={city}
                  placeholder="E.g. Colombo, Nugegoda..."
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Purpose Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Listing Purpose
                </label>
                <select
                  name="purpose"
                  defaultValue={purpose}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="">Any Purpose</option>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                  <option value="LEASE">For Lease</option>
                </select>
              </div>

              {/* Property Type Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Property Type
                </label>
                <select
                  name="type"
                  defaultValue={type}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="">Any Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Annex">Annex</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Max Price budget (LKR)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={maxPrice || ''}
                  placeholder="Max Price LKR..."
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Bedrooms Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Bedrooms
                </label>
                <select
                  name="bedrooms"
                  defaultValue={bedrooms || ''}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="">Any Beds</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Right Side: Feed & Map Column */}
        <section className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Feed List */}
          <div className="flex-1 space-y-4">
            {/* Header controls */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h1 className="text-lg font-extrabold text-foreground">
                  Properties Search Results
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  Showing {listings.length} properties matching your query{' '}
                  {usingMock && '(local mock data matches)'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 border border-border bg-secondary/50 p-1 rounded-lg">
                <button className="p-1 rounded bg-card text-foreground shadow-sm">
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded hover:bg-card text-muted-foreground hover:text-foreground">
                  <Map className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Results Grid */}
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((item) => (
                  <ListingCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-secondary/20 rounded-2xl border border-dashed border-border/80">
                <p className="text-sm font-semibold text-muted-foreground">No matching properties found.</p>
                <p className="text-xs text-muted-foreground mt-1">Try broadening your filter criteria or location input.</p>
                <Link href="/search" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">
                  Reset Filters
                </Link>
              </div>
            )}
          </div>

          {/* Interactive Map Preview */}
          <div className="hidden lg:block w-[340px] xl:w-[400px] shrink-0">
            <div className="sticky top-20 h-[calc(100vh-120px)] rounded-2xl overflow-hidden border border-border/80 bg-secondary/30 relative flex flex-col items-center justify-center p-6 text-center">
              {/* Background grids */}
              <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/79.88,6.87,11,0/400x600?access_token=mock')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

              {/* Pin Icons */}
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto shadow-xl animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xs text-foreground">Interactive Map View</h3>
                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Pin properties on Google Maps with radius calculations. Configure your Google Maps API key in credentials settings to enable dynamic satellite views.
                </p>
                {listings.map((l, lIdx) => (
                  <div
                    key={l.id}
                    className="p-2 bg-card/90 backdrop-blur border border-border rounded-xl text-left text-[9px] flex gap-2 items-center shadow-md max-w-xs"
                  >
                    <img src={l.image} alt={l.title} className="w-8 h-8 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold truncate text-foreground">{l.title}</h4>
                      <p className="font-extrabold text-primary">{formatLKR(l.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
