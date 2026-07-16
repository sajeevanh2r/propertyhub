import { auth } from '@/auth'
import Navbar from '@/components/Navbar'
import { Shield, Eye, Users, FileText, CheckCircle2, XCircle, TrendingUp, Cpu } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await auth()
  const userName = session?.user?.name || 'Administrator'

  const mockOverview = [
    { label: 'Weekly Revenue', value: 'LKR 425,000', icon: TrendingUp, change: '+18% vs last week' },
    { label: 'Total Users', value: '14,842', icon: Users, change: '104 registrations today' },
    { label: 'Pending Approvals', value: '3 Listings', icon: FileText, change: 'Requires manual review' },
    { label: 'AI Chat Queries', value: '3,842', icon: Cpu, change: '99.2% grounded score' },
  ]

  const mockPendingApprovals = [
    {
      id: 'pending-1',
      title: 'Commercial Land in Negombo City Boundary',
      seller: 'Lanka Developers',
      price: '45,000,000 LKR',
      date: '10 minutes ago',
    },
    {
      id: 'pending-2',
      title: 'Colonial Bungalow for Sale in Kandy',
      seller: 'Estate Agents Ltd',
      price: '92,000,000 LKR',
      date: '1 hour ago',
    },
    {
      id: 'pending-3',
      title: 'Cozy Annex for Lease near Galle Fort',
      seller: 'Devinda Perera',
      price: '85,000 LKR /mo',
      date: '3 hours ago',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-teal-500/5 border border-primary/10 mb-8">
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Hello, {userName}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            System Administration Panel. Manage users, verify properties, check database vector sync status, and review chatbot logs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockOverview.map((item, oIdx) => {
            const Icon = item.icon
            return (
              <div key={oIdx} className="glass-card rounded-2xl border border-border/85 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-foreground">{item.value}</h3>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                    {item.change}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Moderation Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" /> Listing Moderation Queue
              </h2>

              <div className="space-y-4">
                {mockPendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-xl p-4 bg-secondary/20 flex items-center justify-between flex-wrap gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-xs text-foreground">{item.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Seller: {item.seller} | Price: {item.price}
                      </p>
                      <span className="inline-block mt-2 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                        Submitted {item.date}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-teal-500 text-white text-[10px] font-bold hover:bg-teal-600 transition-all flex items-center gap-1 cursor-pointer">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-[10px] font-bold hover:bg-destructive/20 transition-all flex items-center gap-1 cursor-pointer">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-primary" /> System Metrics
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground font-medium">PostgreSQL Database:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground font-medium">Redis Server:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">ONLINE</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground font-medium">Vector Store (pgvector):</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">ACTIVE (1536d)</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground font-medium">Last DB Seed Sync:</span>
                  <span className="font-semibold text-foreground">100% Synced</span>
                </div>
              </div>
            </div>

            {/* Admin Audit Trail */}
            <div className="glass-card rounded-2xl border border-border/80 p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
                Audit Trail
              </h2>
              <div className="space-y-2.5 text-[10px] text-muted-foreground">
                <p>&bull; Admin approved listing #3948 (5 mins ago)</p>
                <p>&bull; User registration seller@propertyhub.lk (1 hour ago)</p>
                <p>&bull; Database backup successfully written to S3 (3 hours ago)</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
