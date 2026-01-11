"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn, formatTime, getEventPosition } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";
import { GripVertical } from "lucide-react";

type EventBlockProps = {
  event: CalendarEvent;
  dayStartHour?: number;
};

// Height threshold for compact mode (in pixels)
const COMPACT_HEIGHT_THRESHOLD = 35;

export function EventBlock({ event, dayStartHour = 6 }: EventBlockProps) {
  const { top, height } = getEventPosition(
    event.start,
    event.end,
    dayStartHour,
  );

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `existing-${event.id}`,
      data: { event, isExisting: true },
    });

  const style = {
    top: `${top}px`,
    height: `${height}px`,
    transform: CSS.Transform.toString(transform),
  };

  const isCompact = height < COMPACT_HEIGHT_THRESHOLD;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute left-1 right-1 rounded-md px-2",
        "bg-[var(--event-existing)] text-[var(--event-existing-text)]",
        "text-[10px] font-medium overflow-hidden",
        "cursor-grab transition-colors duration-200",
        "border-2 border-transparent hover:border-black",
        isCompact ? "py-0.5 flex items-center" : "py-1",
        isDragging && "opacity-50 z-50 shadow-lg cursor-grabbing",
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      {isCompact ? (
        // Compact horizontal layout for small blocks
        <div className="flex items-center gap-1 w-full min-w-0">
          <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50" />
          <span className="font-semibold truncate">{event.title}</span>
          <span className="opacity-75 flex-shrink-0">
            {formatTime(event.start)}
          </span>
        </div>
      ) : (
        // Standard vertical layout for larger blocks
        <div className="flex items-start gap-1">
          <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold break-words">{event.title}</div>
            <div className="opacity-75">
              {formatTime(event.start)} – {formatTime(event.end)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
