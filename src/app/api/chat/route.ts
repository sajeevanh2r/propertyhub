import { NextResponse } from 'next/server'
import { queryRAGChatbot } from '@/lib/chatbot'

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const response = await queryRAGChatbot(message, history || [])
    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your chat.' },
      { status: 500 }
    )
  }
}
