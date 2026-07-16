'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Home, ChevronRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface ListingCard {
  id: string
  title: string
  price: number
  city: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
}

interface Citation {
  title: string
  url: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  listings?: ListingCard[]
  citations?: Citation[]
}

const STARTER_PROMPTS = [
  { text: 'Houses under 25M in Nugegoda', icon: Home },
  { text: 'How does property verification work?', icon: HelpCircle },
  { text: 'Refund rules for listing boosts', icon: HelpCircle },
]

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I am your PropertyHub AI Assistant. Ask me anything about property listings in Sri Lanka, or details about our platform policies and advertising features!',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || "I'm sorry, I couldn't process that request.",
        listings: data.listings,
        citations: data.citations,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops! I encountered an error connecting to the AI. Please make sure the database is seeded and your API keys are configured, or try again later.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatLKR = (value: number) => {
    if (value >= 10000000) return `LKR ${(value / 10000000).toFixed(1)} Crore`
    if (value >= 100000) return `LKR ${(value / 100000).toFixed(1)} Lakh`
    return `LKR ${value.toLocaleString()}`
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/40 cursor-pointer relative group"
      >
        <span className="absolute -inset-1.5 rounded-full bg-primary/20 animate-ping group-hover:animate-none opacity-75"></span>
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageCircle className="w-6 h-6 relative z-10" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute bottom-20 right-0 w-[92vw] sm:w-[400px] h-[600px] rounded-2xl glass-card border border-border flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">PropertyHub AI</h3>
                  <p className="text-[10px] text-teal-200 font-medium">Grounded in Live Data</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 transition-colors text-primary-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-secondary text-secondary-foreground rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Render listings if helper returned cards */}
                  {msg.listings && msg.listings.length > 0 && (
                    <div className="w-full mt-2.5 overflow-x-auto no-scrollbar flex gap-3 py-1">
                      {msg.listings.map((item) => (
                        <div
                          key={item.id}
                          className="min-w-[200px] max-w-[200px] rounded-xl bg-card border border-border overflow-hidden hover:shadow-md transition-all flex flex-col"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-24 object-cover"
                          />
                          <div className="p-2 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-xs truncate text-foreground">{item.title}</h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{item.city}</p>
                              <p className="text-[11px] font-extrabold text-primary mt-1">
                                {formatLKR(item.price)}
                              </p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[9px] text-muted-foreground">
                              <span>{item.bedrooms} Bed</span>
                              <span>{item.bathrooms} Bath</span>
                              <span>{item.area} sqft</span>
                            </div>
                            <Link
                              href={`/search?id=${item.id}`}
                              className="mt-2 block w-full py-1 text-center bg-secondary text-[10px] font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              View Property
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render inline citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 ml-2">
                      <span className="text-[10px] text-muted-foreground self-center">Sources:</span>
                      {msg.citations.map((cit, cIdx) => (
                        <Link
                          key={cIdx}
                          href={cit.url}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-900 font-medium hover:underline flex items-center gap-0.5"
                        >
                          {cit.title}
                          <ChevronRight className="w-2 h-2" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground rounded-2xl rounded-tl-none px-4 py-3 max-w-[150px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-300"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starters (only visible when chat starts) */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 border-t border-border/40 bg-secondary/20">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
                  Suggested Questions
                </p>
                <div className="space-y-1.5">
                  {STARTER_PROMPTS.map((prompt, pIdx) => {
                    const Icon = prompt.icon
                    return (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt.text)}
                        className="w-full flex items-center gap-2 text-left p-2 rounded-xl bg-card border border-border hover:bg-primary/5 hover:border-primary/30 transition-all text-xs text-foreground cursor-pointer"
                      >
                        <Icon className="w-3.5 h-3.5 text-primary" />
                        <span className="flex-1 truncate">{prompt.text}</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Message Input Box */}
            <div className="p-3 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(input)
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 text-sm bg-secondary px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-primary border border-border"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
