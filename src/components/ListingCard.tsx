'use client'

import Link from 'next/link'
import { MapPin, BedDouble, Bath, Square, Flame, Crown, CheckCircle } from 'lucide-react'

interface ListingCardProps {
  id: string
  title: string
  price: number
  negotiable: boolean
  propertyType: string
  purpose: string
  bedrooms: number
  bathrooms: number
  area: number
  city: string
  district: string
  premiumBadge: string
  image: string
}

export default function ListingCard({
  id,
  title,
  price,
  negotiable,
  propertyType,
  purpose,
  bedrooms,
  bathrooms,
  area,
  city,
  district,
  premiumBadge,
  image,
}: ListingCardProps) {
  const formatLKR = (value: number) => {
    if (value >= 10000000) return `LKR ${(value / 10000000).toFixed(2)} Crore`
    if (value >= 100000) return `LKR ${(value / 100000).toFixed(1)} Lakh`
    return `LKR ${value.toLocaleString()}`
  }

  const renderBadge = () => {
    if (premiumBadge === 'FEATURED') {
      return (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-yellow-500 text-black text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-md">
          <Crown className="w-3 h-3" /> FEATURED
        </span>
      )
    }
    if (premiumBadge === 'TOP') {
      return (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-md">
          <Crown className="w-3 h-3" /> TOP LISTING
        </span>
      )
    }
    if (premiumBadge === 'URGENT') {
      return (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-md animate-pulse">
          <Flame className="w-3 h-3" /> URGENT
        </span>
      )
    }
    return null
  }

  return (
    <div className="group relative rounded-2xl border border-border/80 overflow-hidden glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Property Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {renderBadge()}
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest">
          {purpose}
        </span>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Negotiability */}
          <div className="flex items-center gap-1.5 justify-between">
            <span className="font-extrabold text-lg text-primary tracking-tight">
              {formatLKR(price)}
              {purpose === 'RENT' || purpose === 'LEASE' ? <span className="text-xs font-normal text-muted-foreground">/mo</span> : null}
            </span>
            {negotiable && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
                Negotiable
              </span>
            )}
          </div>

          {/* Title & Type */}
          <h3 className="font-bold text-sm text-foreground mt-2 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Location */}
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            {city}, {district}
          </p>
        </div>

        {/* Specs & Action */}
        <div className="mt-4">
          <div className="py-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-muted-foreground/75" />
              {bedrooms} Bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-muted-foreground/75" />
              {bathrooms} Bath
            </span>
            <span className="flex items-center gap-1">
              <Square className="w-3.5 h-3.5 text-muted-foreground/75" />
              {area} sqft
            </span>
          </div>

          <Link
            href={`/search?id=${id}`}
            className="mt-3 block w-full py-2.5 text-center bg-secondary hover:bg-primary hover:text-primary-foreground text-xs font-bold rounded-xl transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
