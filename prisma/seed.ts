import { PrismaClient, Role, Purpose, ListingStatus, PremiumBadge } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgrespassword@localhost:5442/propertyhub?schema=public"
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seeding database...')

  // 1. Clean existing records (in reverse order of dependencies)
  await prisma.kBEmbedding.deleteMany({})
  await prisma.listingEmbedding.deleteMany({})
  await prisma.favorite.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.listingImage.deleteMany({})
  await prisma.listing.deleteMany({})
  await prisma.subscription.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.profile.deleteMany({})
  await prisma.loginHistory.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.knowledgeBase.deleteMany({})

  console.log('Cleared existing data.')

  // 2. Create users with hashed passwords
  const saltRounds = 10
  const hashedPassword = bcrypt.hashSync('password123', saltRounds)

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@propertyhub.lk',
      password: hashedPassword,
      role: Role.ADMIN,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      profile: {
        create: {
          phoneNumber: '+94 77 111 2222',
          bio: 'System Administrator for PropertyHub.',
          address: 'No 100, Galle Road, Colombo 03',
        }
      },
      loginHistories: {
        create: [
          { ipAddress: '192.168.1.1', userAgent: 'Chrome / Windows', device: 'Desktop', country: 'Sri Lanka' },
          { ipAddress: '192.168.1.12', userAgent: 'Safari / macOS', device: 'Desktop', country: 'Sri Lanka' },
        ]
      }
    },
  })

  const sellerUser = await prisma.user.create({
    data: {
      name: 'Sajeevan Real Estate',
      email: 'seller@propertyhub.lk',
      password: hashedPassword,
      role: Role.SELLER,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      profile: {
        create: {
          phoneNumber: '+94 77 333 4444',
          bio: 'Premier Real Estate Agency in Colombo.',
          address: 'No 45, Alfred House Gardens, Colombo 03',
        }
      },
      loginHistories: {
        create: [
          { ipAddress: '192.168.1.5', userAgent: 'Chrome / Windows', device: 'Desktop', country: 'Sri Lanka' },
          { ipAddress: '192.168.1.9', userAgent: 'Safari / iPhone', device: 'Mobile', country: 'Sri Lanka' },
        ]
      }
    },
  })

  const buyerUser = await prisma.user.create({
    data: {
      name: 'Amara Perera',
      email: 'buyer@propertyhub.lk',
      password: hashedPassword,
      role: Role.BUYER,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      profile: {
        create: {
          phoneNumber: '+94 77 555 6666',
          bio: 'Looking for a 3-bedroom house near Nugegoda.',
          address: 'No 12, High Level Road, Nugegoda',
        }
      },
      loginHistories: {
        create: [
          { ipAddress: '192.168.1.20', userAgent: 'Chrome / Android', device: 'Mobile', country: 'Sri Lanka' },
        ]
      }
    },
  })

  console.log(`Created users: Admin (${adminUser.email}), Seller (${sellerUser.email}), Buyer (${buyerUser.email})`)

  // 3. Create dummy listing data
  const listingsData = [
    {
      title: 'Modern 3-Bedroom House in Nugegoda',
      description: 'A beautiful architectural marvel situated in the heart of Nugegoda. This modern house boasts 3 spacious bedrooms, 3 bathrooms, a fully equipped open kitchen, and a secure parking garage. Close to leading international schools and supermarkets. Located in a quiet, high-security residential neighborhood. Ideal for families.',
      price: 24500000, // 24.5M LKR
      negotiable: true,
      propertyType: 'House',
      purpose: Purpose.SALE,
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      parking: 2,
      floors: 2,
      furnished: true,
      amenities: JSON.stringify(['AC', 'Hot Water', 'CCTV', 'Garden', 'Roof Terrace', 'Mainline Water']),
      address: 'No 42, Chapel Road, Nugegoda',
      city: 'Nugegoda',
      district: 'Colombo',
      latitude: 6.8722,
      longitude: 79.8887,
      status: ListingStatus.LIVE,
      premiumBadge: PremiumBadge.FEATURED,
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      ],
    },
    {
      title: 'Luxury Apartment in Colombo 3 (Kollupitiya)',
      description: 'Stunning ocean-view apartment on a high floor in Colombo 03. This prime property features 2 bedrooms, 2 bathrooms, marble flooring, central air conditioning, and access to a rooftop infinity pool and modern gymnasium. Includes 24/7 security and dedicated underground parking slot.',
      price: 68000000, // 68M LKR
      negotiable: false,
      propertyType: 'Apartment',
      purpose: Purpose.SALE,
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      parking: 1,
      floors: 1,
      furnished: true,
      amenities: JSON.stringify(['AC', 'Hot Water', 'Swimming Pool', 'Gym', 'CCTV', '24/7 Security', 'Backup Generator']),
      address: 'Tower A, Ocean Breeze Apartments, Colombo 03',
      city: 'Colombo 03',
      district: 'Colombo',
      latitude: 6.9144,
      longitude: 79.8495,
      status: ListingStatus.LIVE,
      premiumBadge: PremiumBadge.TOP,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
    {
      title: 'Spacious Commercial Building in Kandy Center',
      description: 'Ideal retail or office space located in the bustling commercial zone of Kandy town center. Spans across 3 levels with large road-facing glass facades. High foot traffic area, perfect for banks, showrooms, corporate offices, or educational institutes. Provision for elevator and parking space in front.',
      price: 180000000, // 180M LKR
      negotiable: true,
      propertyType: 'Commercial',
      purpose: Purpose.SALE,
      bedrooms: 0,
      bathrooms: 4,
      area: 4500,
      parking: 4,
      floors: 3,
      furnished: false,
      amenities: JSON.stringify(['Mainline Water', 'Three-phase Electricity', 'Backup Generator', 'Road Frontage']),
      address: 'No 150, D.S. Senanayake Veediya, Kandy',
      city: 'Kandy',
      district: 'Kandy',
      latitude: 7.2906,
      longitude: 80.6337,
      status: ListingStatus.LIVE,
      premiumBadge: PremiumBadge.URGENT,
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      ],
    },
    {
      title: 'Stunning Beachfront Villa for Lease in Galle',
      description: 'A scenic beachfront villa located in Unawatuna, Galle, available for long term lease. Perfect for tourism or holiday rental operations. Offers 4 colonial-style bedrooms, private swimming pool, landscaped tropical garden, and direct private path to the sandy beach. Fully furnished with antique teak wood items.',
      price: 450000, // 450k LKR / month
      negotiable: true,
      propertyType: 'Villa',
      purpose: Purpose.LEASE,
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      parking: 3,
      floors: 2,
      furnished: true,
      amenities: JSON.stringify(['AC', 'Hot Water', 'Swimming Pool', 'Garden', 'Beachfront', 'Servant Quarters']),
      address: 'No 8, Wella Dewala Road, Unawatuna, Galle',
      city: 'Galle',
      district: 'Galle',
      latitude: 6.0142,
      longitude: 80.2489,
      status: ListingStatus.LIVE,
      premiumBadge: PremiumBadge.NONE,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
      ],
    },
    {
      title: 'Residential Land Plot in Negombo',
      description: 'Prime 15 perches residential land plot in Negombo, within close proximity to Negombo Lagoon and city center. Highly residential, peaceful environment. Clear deeds and survey plan. Pipe-borne water, electricity, and broad carpeted access roads are already established. Perfect to build your dream home.',
      price: 12000000, // 12M LKR total
      negotiable: true,
      propertyType: 'Land',
      purpose: Purpose.SALE,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      landSize: 15.0, // perches
      parking: 0,
      floors: 0,
      furnished: false,
      amenities: JSON.stringify(['Mainline Water', 'Electricity', 'Clear Deeds']),
      address: 'Plot B, Lagoon View Gardens, Negombo',
      city: 'Negombo',
      district: 'Gampaha',
      latitude: 7.2089,
      longitude: 79.8351,
      status: ListingStatus.LIVE,
      premiumBadge: PremiumBadge.NONE,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      ],
    },
    {
      title: 'Cozy Annex for Rent in Dehiwala',
      description: 'Fully tiled 1-bedroom annex for rent in a respectable neighborhood in Dehiwala. Features 1 bedroom, 1 bathroom, living area, and a mini kitchen. Separate entrance, separate electricity and water bills. Walkable distance to Galle Road and Hill Street. Best suited for working professionals or couples.',
      price: 45000, // 45,000 LKR / month
      negotiable: false,
      propertyType: 'Annex',
      purpose: Purpose.RENT,
      bedrooms: 1,
      bathrooms: 1,
      area: 550,
      parking: 1,
      floors: 1,
      furnished: false,
      amenities: JSON.stringify(['Separate Utility Bills', 'Mainline Water', 'Secure Boundary']),
      address: 'No 15/4, Karunarathne Lane, Dehiwala',
      city: 'Dehiwala',
      district: 'Colombo',
      latitude: 6.8401,
      longitude: 79.8732,
      status: ListingStatus.LIVE,
      premiumBadge: PremiumBadge.NONE,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
    },
  ]

  for (const listing of listingsData) {
    const { images, ...coreDetails } = listing
    const createdListing = await prisma.listing.create({
      data: {
        ...coreDetails,
        sellerId: sellerUser.id,
      },
    })

    // Create related images
    for (const url of images) {
      await prisma.listingImage.create({
        data: {
          url,
          listingId: createdListing.id,
        },
      })
    }
  }

  console.log(`Successfully seeded ${listingsData.length} property listings.`)

  // 4. Create FAQ and Platform Policy documentations for RAG Chatbot
  const kbData = [
    {
      title: 'Refund Policy for Advertising Packages',
      category: 'POLICY',
      sourceUrl: '/refund-policy',
      content: `PropertyHub offers various promotion options to increase listing visibility, such as Featured Listings, Top Listings, and Urgent Badges. Our refund rules are as follows:
1. Boost packages and subscriptions are generally non-refundable once activated.
2. If your property is sold before the boost duration expires, we do not provide partial refunds or transfer the remaining days to another listing.
3. In the event that a listing is rejected during our moderation review due to violation of posting policies (e.g., fraudulent listings, duplicate entries, offensive content), the boost fee will be refunded back to the original payment source (Stripe or PayHere) within 5-7 business days, minus a nominal admin processing fee of 5%.
4. If there is a double payment due to a technical error on our platform, you will receive a full 100% refund upon submitting a support ticket with transaction logs.`,
    },
    {
      title: 'Understanding Boost Packages: Featured, Top, and Urgent',
      category: 'FAQ',
      sourceUrl: '/help/boosting',
      content: `Sellers can upgrade their properties using three distinct boost tiers on PropertyHub:
- Featured Listings: Displayed in the prominent sliding carousel at the top of the homepage and search feeds. This category gets up to 10x more visibility. Pricing is LKR 5,000 for 7 days or LKR 15,000 for 30 days.
- Top Listings: Placed above all standard listings in search results, highlighted with a distinct premium border. Gets up to 5x more clicks. Pricing is LKR 3,000 for 7 days.
- Urgent Badges: Adds a bright red "Urgent" sticker on your listing card, urging potential buyers to contact immediately. Often used when the seller is migrating or needs quick cash. Pricing is LKR 1,500 for 7 days.
All boosts can be purchased using Credit/Debit Cards via Stripe or local payment links.`,
    },
    {
      title: 'Property Verification and Trust Badges',
      category: 'POLICY',
      sourceUrl: '/verification-guide',
      content: `To prevent scams, duplicate listings, and inaccurate pricing, PropertyHub enforces a rigorous verification process:
1. Sellers can request the "Verified Property" green badge for any listing by submitting proving documents (e.g., deed copy, utility bill showing address, or developer agreement) through the dashboard.
2. PropertyHub moderation team reviews documents within 48 hours. If details match, the listing receives a "Verified" badge.
3. For premium and luxury houses (over 50M LKR), our agents may schedule a physical site visit to inspect the building, capture 360-degree virtual tours, and verify amenities.
4. Each verified listing gets a unique QR Code generated on the printable PDF brochure, which users can scan to verify its live status on our official website.`,
    },
    {
      title: 'Listing Rules and Anti-Fraud Guidelines',
      category: 'POLICY',
      sourceUrl: '/terms/listing-rules',
      content: `PropertyHub is committed to keeping the marketplace safe. All postings must adhere to the following rules:
- No Duplicate Listings: You cannot list the same property more than once, even under different titles, photos, or descriptions. Duplicate listings will be flagged automatically and deleted.
- Accurate Pricing: The listed price must be the actual expected price. Listing properties with mock low prices (e.g., LKR 1) to gain search traction is strictly prohibited and will result in listing suspension.
- Copyrighted Images: Photos uploaded must be genuine photos of the property. Using stock images or images watermark-marked by other real estate portals (e.g., Ikman, LankaPropertyWeb) is prohibited.
- Scam Prevention: Sellers should never demand advance deposits before showing the property in person. Buyers are urged to visit properties and verify credentials before transferring any funds.`,
    },
    {
      title: 'How to Contact Customer Support',
      category: 'FAQ',
      sourceUrl: '/contact',
      content: `PropertyHub provides multi-channel customer service to assist buyers, sellers, and agents:
- Email Support: Send your queries to support@propertyhub.lk. We reply within 4 hours during business days.
- Hotline: Call us at +94 11 777 8888 (available from 8:30 AM to 6:00 PM, Monday through Saturday).
- Live Chat: Open the chat icon in the bottom right corner of the dashboard to talk to a support agent.
- Head Office: Located at No 100, Galle Road, Colombo 03, Sri Lanka. Physical visits are by appointment only.`,
    },
  ]

  for (const kb of kbData) {
    await prisma.knowledgeBase.create({
      data: kb,
    })
  }

  console.log(`Successfully seeded ${kbData.length} FAQ / policy documents in KnowledgeBase.`)
  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
