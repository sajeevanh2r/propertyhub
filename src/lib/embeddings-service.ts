import { db } from './db'

// Generate a 1536-dimensional float vector (mock or OpenAI)
export async function generateEmbedding(text: string): Promise<number[]> {
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-key-for-local-dev'

  if (hasOpenAI) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small', // 1536 dimensions
          input: text,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        return result.data[0].embedding
      }
    } catch (e) {
      console.warn('OpenAI embedding generation failed, falling back to mock vector...', e)
    }
  }

  // Fallback: Generate a normalized mock vector (1536 dimensions)
  const vector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
  return vector.map((val) => val / magnitude)
}

// Service to compile and upsert listing embeddings
export async function embedListing(listingId: string) {
  try {
    const listing = await db.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      console.warn(`Listing with ID ${listingId} not found, skipping embedding.`)
      return
    }

    // Compile text chunk
    const chunkText = `Title: ${listing.title}
Price: LKR ${listing.price.toLocaleString()} (${listing.negotiable ? 'Negotiable' : 'Fixed'})
Type: ${listing.propertyType}
Purpose: ${listing.purpose}
Specifications: ${listing.bedrooms} Beds, ${listing.bathrooms} Baths, ${listing.area} sqft, ${listing.parking} Parking slots, ${listing.floors} Floors
Location: ${listing.address}, ${listing.city}, ${listing.district}
Description: ${listing.description}`

    const vector = await generateEmbedding(chunkText)
    const vectorString = `[${vector.join(',')}]`
    const metadata = JSON.stringify({
      price: listing.price,
      city: listing.city,
      district: listing.district,
      propertyType: listing.propertyType,
      purpose: listing.purpose,
      bedrooms: listing.bedrooms,
    })

    const id = `emb-${Math.random().toString(36).substr(2, 9)}`

    // Remove existing embeddings for this specific listing source
    await db.$executeRawUnsafe(
      `DELETE FROM "Embedding" WHERE "sourceType" = 'LISTING' AND "sourceId" = $1`,
      listingId
    )

    // Insert new embedding vector
    await db.$executeRawUnsafe(
      `INSERT INTO "Embedding" ("id", "sourceType", "sourceId", "chunkText", "embedding", "metadata", "createdAt", "updatedAt")
       VALUES ($1, 'LISTING', $2, $3, $4::vector, $5, NOW(), NOW())`,
      id,
      listingId,
      chunkText,
      vectorString,
      metadata
    )

    console.log(`Successfully embedded listing ${listingId} (${listing.title})`)
  } catch (error) {
    console.error(`Failed to embed listing ${listingId}:`, error)
  }
}

// Hook that can be registered inside controllers/Server Actions
export async function onListingCreatedOrUpdated(listingId: string) {
  // Run asynchronously in background so client requests aren't blocked
  embedListing(listingId).catch((err) => {
    console.error('Background embedding compilation failed:', err)
  })
}
