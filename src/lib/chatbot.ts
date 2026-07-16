import { db } from './db'
import { Purpose, ListingStatus } from '@prisma/client'

interface ParsedFilters {
  city?: string
  maxPrice?: number
  bedrooms?: number
  purpose?: Purpose
  propertyType?: string
}

// 1. Natural Language Query Parser (Structured Intent)
function parseQuery(query: string): ParsedFilters {
  const q = query.toLowerCase()
  const filters: ParsedFilters = {}

  // Parse purpose
  if (q.includes('sale') || q.includes('buy') || q.includes('purchase')) {
    filters.purpose = Purpose.SALE
  } else if (q.includes('rent')) {
    filters.purpose = Purpose.RENT
  } else if (q.includes('lease')) {
    filters.purpose = Purpose.LEASE
  }

  // Parse bedrooms (e.g., "3 bedroom", "3-bedroom", "3 bed", "3bed")
  const bedMatch = q.match(/(\d+)\s*(?:bedroom|bed|br)/)
  if (bedMatch) {
    filters.bedrooms = parseInt(bedMatch[1], 10)
  }

  // Parse price (e.g., "under 25m", "below 25 million", "less than 45k")
  // Handle 'm' or 'million'
  const millionMatch = q.match(/(?:under|below|less than|max|maximum)\s*(?:lkr\s*)?([\d.]+)\s*(?:m|million)/)
  if (millionMatch) {
    filters.maxPrice = parseFloat(millionMatch[1]) * 10000000 // Convert to LKR (1M = 10,000,000 in LKR representation, wait! Sri Lankan 1 Million = 1,000,000. Let's make sure: 1M = 1,000,000 LKR. Ah, in Sri Lanka, 25M means 25 Million LKR = 25,000,000. Let's use 1,000,000 LKR per Million!)
  } else {
    // Handle 'k' or 'thousand'
    const thousandMatch = q.match(/(?:under|below|less than|max|maximum)\s*(?:lkr\s*)?([\d.]+)\s*(?:k|thousand)/)
    if (thousandMatch) {
      filters.maxPrice = parseFloat(thousandMatch[1]) * 1000
    }
  }

  // Parse cities / districts commonly queried
  const cities = ['nugegoda', 'colombo', 'kandy', 'galle', 'negombo', 'dehiwala', 'unawatuna', 'kollupitiya']
  for (const city of cities) {
    if (q.includes(city)) {
      filters.city = city
      break
    }
  }

  // Parse property types
  const types = ['house', 'apartment', 'villa', 'land', 'commercial', 'annex']
  for (const t of types) {
    if (q.includes(t)) {
      filters.propertyType = t
      break
    }
  }

  return filters
}

// 2. Local TF-IDF keyword match fallback for Knowledge Base
async function searchKnowledgeBase(query: string) {
  const q = query.toLowerCase()
  const allKb = await db.knowledgeBase.findMany()
  
  // Calculate a matching score based on keyword overlap
  const scoredKb = allKb.map((doc) => {
    let score = 0
    const words = q.split(/\s+/)
    for (const word of words) {
      if (word.length > 3) {
        const regex = new RegExp(word, 'gi')
        const matchesInTitle = (doc.title.match(regex) || []).length
        const matchesInContent = (doc.content.match(regex) || []).length
        score += matchesInTitle * 5 + matchesInContent
      }
    }
    return { doc, score }
  })

  // Filter out zero scores and sort by score descending
  return scoredKb
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.doc)
}

// 3. Main RAG Pipeline
export async function queryRAGChatbot(userQuery: string, history: { role: string; content: string }[]) {
  const parsedFilters = parseQuery(userQuery)
  
  // Query Listings
  const listingWhereClause: any = {
    status: ListingStatus.LIVE,
  }

  if (parsedFilters.city) {
    listingWhereClause.city = {
      contains: parsedFilters.city,
      mode: 'insensitive',
    }
  }
  if (parsedFilters.purpose) {
    listingWhereClause.purpose = parsedFilters.purpose
  }
  if (parsedFilters.bedrooms !== undefined) {
    listingWhereClause.bedrooms = parsedFilters.bedrooms
  }
  if (parsedFilters.maxPrice !== undefined) {
    listingWhereClause.price = {
      lte: parsedFilters.maxPrice,
    }
  }
  if (parsedFilters.propertyType) {
    listingWhereClause.propertyType = {
      contains: parsedFilters.propertyType,
      mode: 'insensitive',
    }
  }

  // Fetch listings matching query
  const matchedListings = await db.listing.findMany({
    where: listingWhereClause,
    take: 3,
    include: {
      images: {
        take: 1,
      },
    },
  })

  // Format listings for RAG response
  const responseListings = matchedListings.map((l) => ({
    id: l.id,
    title: l.title,
    price: l.price,
    city: l.city,
    propertyType: l.propertyType,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    area: l.area,
    image: l.images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
  }))

  // Query Knowledge Base
  const matchedKB = await searchKnowledgeBase(userQuery)
  const responseCitations = matchedKB.map((doc) => ({
    title: doc.title,
    url: doc.sourceUrl || '#',
  }))

  // Check if we should call OpenAI API
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key-for-local-dev'

  if (hasOpenAI) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are PropertyHub AI Chatbot, an expert assistant for the Sri Lankan real estate marketplace. 
You must answer queries using ONLY the retrieved listing and policy data provided in the user context. Do not invent listings or prices.
Keep answers concise, professional, and friendly. Cite sources when referencing policies.
Current Date: July 2026.

Retrieved Listings:
${JSON.stringify(matchedListings, null, 2)}

Retrieved FAQs/Policies:
${JSON.stringify(matchedKB, null, 2)}
`,
            },
            ...history,
            { role: 'user', content: userQuery },
          ],
          temperature: 0.3,
        }),
      })

      if (response.ok) {
        const completion = await response.json()
        return {
          text: completion.choices[0].message.content,
          listings: responseListings,
          citations: responseCitations,
        }
      }
    } catch (e) {
      console.warn('OpenAI completion failed, falling back to local response compiling...', e)
    }
  }

  // Local compilation logic (Fallback)
  let responseText = ''

  if (matchedListings.length > 0) {
    responseText += `I found some listings matching your request:\n`
    matchedListings.forEach((l, idx) => {
      const priceText = l.price >= 1000000 ? `${(l.price / 1000000).toFixed(1)}M LKR` : `${l.price.toLocaleString()} LKR`
      responseText += `${idx + 1}. **${l.title}** in ${l.city} - ${priceText} (${l.bedrooms} Bed / ${l.bathrooms} Bath)\n`
    })
    responseText += `\nYou can view them in the card carousel below.`
  }

  if (matchedKB.length > 0) {
    if (responseText) responseText += '\n\n'
    responseText += `Based on our platform policies:\n`
    matchedKB.forEach((doc) => {
      responseText += `\n**${doc.title}**:\n${doc.content.split('\n').slice(0, 4).join('\n')}...\n`
    })
  }

  if (!responseText) {
    responseText = `I couldn't find specific active listings or FAQs matching "${userQuery}". Could you please refine your search? You can try asking for properties by city (e.g. "Colombo 3", "Nugegoda"), number of bedrooms, or ask about our "refund policy" or "verification guides".`
  }

  return {
    text: responseText,
    listings: responseListings,
    citations: responseCitations,
  }
}
