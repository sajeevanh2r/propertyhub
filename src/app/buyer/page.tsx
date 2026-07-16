import { auth } from '@/auth'
import Navbar from '@/components/Navbar'
import { Bookmark, MessageSquare, Calendar, Compass, User, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default async function BuyerDashboard() {
  const session = await auth()
  const userName = session?.user?.name || 'Buyer User'

  const mockSavedProperties = [
    {
      id: 'mock-1',
      title: 'Modern 3-Bedroom House in Nugegoda',
      price: '24,500,000 LKR',
      location: 'Nugegoda, Colombo',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    },
    {
      id: 'mock-2',
      title: 'Luxury Apartment in Colombo 3',
      price: '68,000,000 LKR',
      location: 'Kollupitiya, Colombo 03',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    },
  ]

  const mockConversations = [
    {
      id: 'chat-1',
      agent: 'Sajeevan Real Estate',
      lastMessage: 'Is Saturday at 10 AM okay for the viewing?',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 'chat-2',
      agent: 'PropertyHub Advisor',
      lastMessage: 'Your document verification has passed.',
      time: '1 day ago',
      unread: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-teal-500/5 border border-primary/10 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Welcome, {userName}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your favorite listings, schedule property tours, and view offers.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist / Saved Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <Bookmark className="w-5 h-5 text-primary" /> Saved Properties
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockSavedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="border border-border/60 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col bg-card"
                  >
                    <img src={prop.image} alt={prop.title} className="w-full h-32 object-cover" />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xs truncate text-foreground">{prop.title}</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{prop.location}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-primary">{prop.price}</span>
                        <Link
                          href={`/search?id=${prop.id}`}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          View Listing
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visit Scheduler / Appointments */}
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" /> Upcoming Visit Appointments
              </h2>
              <div className="border border-border rounded-xl p-4 bg-secondary/30 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-xs text-foreground">Modern 3-Bedroom House</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Location: Chapel Road, Nugegoda</p>
                  <p className="text-[10px] text-primary font-semibold mt-1">Date: Saturday, July 18, 2026 at 10:00 AM</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/95 transition-all">
                    Confirm Visit
                  </button>
                  <button className="px-3 py-1.5 rounded-lg border border-border text-[10px] font-bold hover:bg-secondary transition-all">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Message Center Widget */}
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" /> Active Chats
              </h2>
              <div className="space-y-3">
                {mockConversations.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 border border-border rounded-xl hover:bg-secondary/40 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                      {chat.agent[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs truncate text-foreground">{chat.agent}</h4>
                        <span className="text-[9px] text-muted-foreground shrink-0">{chat.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">{chat.lastMessage}</p>
                    </div>
                    {chat.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Profile Widget */}
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" /> Profile Overview
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span className="font-semibold text-foreground">Buyer (Client)</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-semibold text-foreground">July 2026</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Premium Badge:</span>
                  <span className="font-semibold text-primary">None</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
