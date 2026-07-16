import { auth } from '@/auth'
import Navbar from '@/components/Navbar'
import { Plus, BarChart3, MessageSquare, Tag, Eye, Heart, HelpCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'

export default async function SellerDashboard() {
  const session = await auth()
  const userName = session?.user?.name || 'Sajeevan Real Estate'
  const sellerId = session?.user?.id

  let listings: any[] = []
  if (sellerId) {
    try {
      listings = await db.listing.findMany({
        where: {
          sellerId: sellerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (e) {
      console.warn("Failed to fetch seller listings, falling back to mock values", e)
    }
  }

  const mockMyListings = [
    {
      id: 'mock-1',
      title: 'Modern 3-Bedroom House in Nugegoda',
      price: '24,500,000 LKR',
      status: 'LIVE',
      badge: 'FEATURED',
      views: 742,
      leads: 9,
    },
    {
      id: 'mock-2',
      title: 'Luxury Apartment in Colombo 3',
      price: '68,000,000 LKR',
      status: 'LIVE',
      badge: 'TOP',
      views: 520,
      leads: 6,
    },
    {
      id: 'mock-3',
      title: 'Spacious Commercial Building in Kandy Center',
      price: '180,000,000 LKR',
      status: 'LIVE',
      badge: 'URGENT',
      views: 310,
      leads: 3,
    },
  ]

  const myListings = listings.length > 0 ? listings.map((l) => ({
    id: l.id,
    title: l.title,
    price: l.price >= 1000000 ? `${(l.price / 1000000).toFixed(1)}M LKR` : `${l.price.toLocaleString()} LKR`,
    status: l.status,
    badge: l.premiumBadge,
    views: Math.floor(Math.random() * 800) + 100, 
    leads: Math.floor(Math.random() * 15) + 2,    
  })) : mockMyListings

  const mockStats = [
    { label: 'Active Listings', value: String(myListings.length), icon: Tag, change: '+1 this month' },
    { label: 'Total Views', value: '1,842', icon: Eye, change: '+12% vs last week' },
    { label: 'Wishlist Adds', value: '87', icon: Heart, change: '+5% vs last week' },
    { label: 'Leads Generated', value: '18', icon: MessageSquare, change: '3 pending reply' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-teal-500/5 border border-primary/10 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Welcome, {userName}!
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Publish listings, buy boost packages, and analyze lead click-through-rates.
            </p>
          </div>
          <Link
            href="/seller/create-listing"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/25 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create New Listing
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, sIdx) => {
            const Icon = stat.icon
            return (
              <div key={sIdx} className="glass-card rounded-2xl border border-border/85 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                    {stat.change}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Listings & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Listings Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl border border-border/80 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Active Property Listings
                </h2>
                <span className="text-[10px] font-bold bg-secondary border border-border px-2 py-0.5 rounded-md text-muted-foreground">
                  {myListings.length} Active
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-bold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Listing Name</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Views/Leads</th>
                      <th className="pb-3 font-semibold">Badge</th>
                      <th className="pb-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {myListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-foreground">{listing.title}</td>
                        <td className="py-3.5 pr-2 font-semibold text-primary">{listing.price}</td>
                        <td className="py-3.5 pr-2 text-muted-foreground">
                          {listing.views} views / {listing.leads} leads
                        </td>
                        <td className="py-3.5 pr-2">
                          <span className="px-2 py-0.5 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-extrabold text-[9px]">
                            {listing.badge}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex gap-2">
                            <Link
                              href={`/search?id=${listing.id}`}
                              className="text-[10px] font-semibold text-primary hover:underline"
                            >
                              View
                            </Link>
                            <button className="text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Promotion / Boost guide */}
            <div className="glass-card rounded-2xl border border-border/80 p-6 bg-gradient-to-br from-primary/10 to-teal-500/5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" /> Boost Your Sales
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock higher search visibility and secure faster deals. Featured listings show on the carousel slider getting up to 10x more client clicks.
              </p>
              <button className="mt-4 w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20 cursor-pointer">
                Purchase Boost Slot
              </button>
            </div>

            {/* Support Widget */}
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-primary" /> Support Center
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need help editing your listings or checking payment logs?
              </p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-secondary flex justify-between">
                  <span className="text-muted-foreground font-medium">Hotline:</span>
                  <span className="font-semibold">+94 11 777 8888</span>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary flex justify-between">
                  <span className="text-muted-foreground font-medium">Email:</span>
                  <span className="font-semibold">support@propertyhub.lk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
