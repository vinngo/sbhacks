'use client'

import { cn } from '@/lib/utils'
import type { Message as MessageType } from '@/lib/types'

type MessageProps = {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {/* Simple markdown-like rendering for code blocks */}
        {message.content.split(/(```[\s\S]*?```)/g).map((part, i) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // Code block
            const lines = part.slice(3, -3).split('\n')
            const language = lines[0]
            const code = lines.slice(1).join('\n')
            return (
              <pre
                key={i}
                className="bg-background/50 rounded p-2 my-2 text-xs overflow-x-auto"
              >
                <code>{code || language}</code>
              </pre>
            )
          }
          // Regular text - split by newlines and bold markers
          return (
            <span key={i} className="whitespace-pre-wrap">
              {part.split(/(\*\*.*?\*\*)/g).map((segment, j) => {
                if (segment.startsWith('**') && segment.endsWith('**')) {
                  return (
                    <strong key={j}>{segment.slice(2, -2)}</strong>
                  )
                }
                return segment
              })}
            </span>
          )
        })}
      </div>
    </div>
  )
}
