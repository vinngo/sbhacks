'use client'

import { cn, formatTime, getEventPosition } from '@/lib/utils'
import type { CalendarEvent } from '@/lib/types'

type EventBlockProps = {
  event: CalendarEvent
  dayStartHour?: number
}

export function EventBlock({ event, dayStartHour = 6 }: EventBlockProps) {
  const { top, height } = getEventPosition(event.start, event.end, dayStartHour)

  return (
    <div
      className={cn(
        'absolute left-1 right-1 rounded-md px-2 py-1 overflow-hidden',
        'bg-[var(--event-existing)] text-[var(--event-existing-text)]',
        'text-xs font-medium',
        'pointer-events-none' // Existing events are not interactive
      )}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <div className="truncate font-semibold">{event.title}</div>
      {height > 30 && (
        <div className="truncate text-[10px] opacity-75">
          {formatTime(event.start)} - {formatTime(event.end)}
        </div>
      )}
    </div>
  )
}
