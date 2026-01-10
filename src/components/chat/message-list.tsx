'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from './message'
import type { Message as MessageType } from '@/lib/types'
import { Loader2 } from 'lucide-react'

type MessageListProps = {
  messages: MessageType[]
  isStreaming?: boolean
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Schedule Optimizer</p>
          <p className="text-sm">
            Tell me what tasks you need to schedule and I&apos;ll find the best
            times in your calendar.
          </p>
          <p className="text-sm mt-4 italic">
            Example: &quot;I need 2 hours for essay writing and 1 hour for interview
            prep this week&quot;
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-1">
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isStreaming && (
          <div className="flex items-center gap-2 text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
