import { db } from './db'

export async function runCleanupJob() {
  console.log('Starting PropertyHub database cleanup job...')
  const now = new Date()
  let staleEmbeddingsDeleted = 0
  let oldChatMessagesDeleted = 0
  let oldChatConversationsDeleted = 0

  try {
    // 1. Cleanup Stale Listings Embeddings
    const listingEmbeddings = await db.$queryRaw<Array<{ sourceId: string }>>`
      SELECT "sourceId" FROM "Embedding" WHERE "sourceType" = 'LISTING'
    `

    for (const emb of listingEmbeddings) {
      const exists = await db.listing.findUnique({
        where: { id: emb.sourceId },
        select: { id: true },
      })

      if (!exists) {
        await db.$executeRawUnsafe(
          `DELETE FROM "Embedding" WHERE "sourceType" = 'LISTING' AND "sourceId" = $1`,
          emb.sourceId
        )
        staleEmbeddingsDeleted++
      }
    }
    console.log(`Pruned ${staleEmbeddingsDeleted} stale listing vector embeddings.`)

    // 2. Cleanup Old Chat Logs (older than 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Delete ChatMessages first (foreign key dependency)
    const messageDeleteResult = await db.chatMessage.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    })
    oldChatMessagesDeleted = messageDeleteResult.count

    // Delete ChatConversations where there are no messages left or created > 30 days ago
    const conversationDeleteResult = await db.chatConversation.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    })
    oldChatConversationsDeleted = conversationDeleteResult.count

    console.log(`Purged ${oldChatMessagesDeleted} old chat messages.`);
    console.log(`Purged ${oldChatConversationsDeleted} old chat conversations.`);
    console.log('Cleanup job finished successfully!');

    return {
      success: true,
      staleEmbeddingsDeleted,
      oldChatMessagesDeleted,
      oldChatConversationsDeleted,
    }
  } catch (error) {
    console.error('Error executing database cleanup job:', error)
    return {
      success: false,
      error,
    }
  }
}
