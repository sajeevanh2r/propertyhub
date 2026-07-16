import Navbar from '@/components/Navbar'
import SearchForm from '@/components/SearchForm'
import ListingCard from '@/components/ListingCard'
import ChatbotWidget from '@/components/ChatbotWidget'
import { db } from '@/lib/db'
import { Crown, Sparkles, ShieldCheck, Zap, Building } from 'lucide-react'

// Mock properties to use as a fallback if the database has not been seeded or migrated yet
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

async function getFeaturedListings() {
  try {
    const listings = await db.listing.findMany({
      where: {
        status: 'LIVE',
      },
      take: 4,
      include: {
        images: {
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (listings.length === 0) return MOCK_PROPERTIES

    return listings.map((l) => ({
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
      image: l.images[0]?.url || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    }))
  } catch (error) {
    console.warn('Database not available or empty, loading mock properties...', error)
    return MOCK_PROPERTIES
  }
}

export default async function Home() {
  const featuredListings = await getFeaturedListings()

  return (
    <div className="min-h-screen flex flex-col aurora-container">
      {/* Aurora Ambient Glow elements */}
      <div className="aurora-glow-1 top-[-100px] left-[-100px] opacity-60"></div>
      <div className="aurora-glow-2 top-[300px] right-[-100px] opacity-40"></div>

      <Navbar />

      {/* Hero Section */}
      <header className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="flex justify-center mb-4">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Real Estate Marketplace
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
          Find Your Perfect Space in{' '}
          <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
            Sri Lanka
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          Search residential, commercial, and land listings across the island. Get grounded answers to your property and pricing queries with our advanced RAG AI Chatbot.
        </p>

        {/* Floating Search Form */}
        <div className="mt-10 md:mt-14 relative z-10">
          <SearchForm />
        </div>
      </header>

      {/* Key Features / Skyline Stats */}
      <section className="py-12 bg-secondary/50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Verified Listings</h3>
            <p className="text-xs text-muted-foreground mt-1">Inspected properties with genuine details</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Premium Boosts</h3>
            <p className="text-xs text-muted-foreground mt-1">Get 10x more leads with Featured packages</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Advanced RAG AI</h3>
            <p className="text-xs text-muted-foreground mt-1">Conversational bot grounded in active listings</p>
          </div>
          <div className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Island-wide Reach</h3>
            <p className="text-xs text-muted-foreground mt-1">Listings in Colombo, Kandy, Galle, & Negombo</p>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" /> Featured Premium Properties
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Explore handpicked top-performing listings from verified agencies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((property) => (
            <ListingCard key={property.id} {...property} />
          ))}
        </div>
      </main>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-secondary/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-xl">
              <h3 className="font-bold text-sm text-foreground">How do I verify my property listing?</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                You can upload documents such as the deed, municipal assessment bill, or developer agreements through the seller dashboard. Our moderation team verifies entries within 48 hours to grant the green "Verified" badge.
              </p>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl">
              <h3 className="font-bold text-sm text-foreground">What advertising packages do you offer?</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                We offer Featured Listing slots (top sliding placement on home and search), Top Listing slots (prioritized above standard search output), and Urgent Badges (highlighted stickers for Migrating/Migrating listings).
              </p>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl">
              <h3 className="font-bold text-sm text-foreground">How does the RAG AI chatbot help me?</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Unlike general LLMs, our AI assistant is retrieved-then-generated (RAG), meaning it queries our live property listings database and platform FAQs to give accurate, grounded answers, complete with interactive cards and sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between gap-8 text-xs text-muted-foreground">
          <div>
            <div className="font-black text-foreground text-sm tracking-tight mb-2">PropertyHub Ltd</div>
            <p>Sri Lanka&apos;s Next-Generation Real Estate Platform.</p>
            <p className="mt-1">Head Office: No 100, Galle Road, Colombo 03.</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-6 font-medium text-foreground">
            <a href="/terms" className="hover:underline">Terms of Use</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/refund-policy" className="hover:underline">Refund Policy</a>
            <a href="/contact" className="hover:underline">Contact Us</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[10px] text-muted-foreground mt-8 border-t border-border/40 pt-4">
          &copy; {new Date().getFullYear()} PropertyHub Sri Lanka. All rights reserved. Powered by Advanced Agentic AI.
        </div>
      </footer>

      {/* Site-wide Grounded RAG Chatbot */}
      <ChatbotWidget />
    </div>
  )
}
