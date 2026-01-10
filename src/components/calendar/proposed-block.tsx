'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn, formatTime, getEventPosition } from '@/lib/utils'
import type { ProposedEvent } from '@/lib/types'
import { GripVertical } from 'lucide-react'

type ProposedBlockProps = {
  event: ProposedEvent
  dayStartHour?: number
}

export function ProposedBlock({ event, dayStartHour = 6 }: ProposedBlockProps) {
  const { top, height } = getEventPosition(event.start, event.end, dayStartHour)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { event },
  })

  const style = {
    top: `${top}px`,
    height: `${height}px`,
    transform: CSS.Transform.toString(transform),
  }

  const isUserAdjusted = event.status === 'user-adjusted'
  const isCommitted = event.status === 'committed'

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1 overflow-hidden',
        'border-2 border-dashed cursor-grab',
        'text-xs font-medium transition-colors',
        isUserAdjusted
          ? 'bg-[var(--event-user-adjusted)] border-[var(--event-user-adjusted-border)]'
          : 'bg-[var(--event-proposed)] border-[var(--event-proposed-border)] opacity-80',
        isCommitted && 'opacity-60 cursor-default',
        isDragging && 'opacity-50 z-50 shadow-lg'
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-1">
        {!isCommitted && (
          <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="truncate font-semibold">{event.title}</div>
          {height > 30 && (
            <div className="truncate text-[10px] opacity-75">
              {formatTime(event.start)} - {formatTime(event.end)}
            </div>
          )}
          {height > 50 && event.reasoning && (
            <div className="truncate text-[10px] opacity-60 mt-1 italic">
              {event.reasoning}
            </div>
          )}
        </div>
      </div>
      {isUserAdjusted && (
        <div className="absolute top-1 right-1">
          <span className="text-[8px] bg-[var(--event-user-adjusted-border)] text-white px-1 rounded">
            Locked
          </span>
        </div>
      )}
    </div>
  )
}
