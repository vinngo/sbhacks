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

export function EventBlock({ event, dayStartHour = 6 }: EventBlockProps) {
  const { top, height } = getEventPosition(
    event.start,
    event.end,
    dayStartHour
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

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute left-1 right-1 rounded-md px-2 py-1",
        "bg-[var(--event-existing)] text-[var(--event-existing-text)]",
        "text-[10px] font-medium overflow-y-auto",
        "cursor-grab transition-colors duration-200",
        "border-2 border-transparent hover:border-black",
        isDragging && "opacity-50 z-50 shadow-lg cursor-grabbing"
      )}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-1">
        <GripVertical className="h-3 w-3 flex-shrink-0 opacity-50 mt-0.5" />
        <div className="flex-1 min-w-0">
          {/* Event title */}
          <div className="font-semibold break-words">{event.title}</div>

          {/* Time */}
          <div className="opacity-75">
            {formatTime(event.start)} – {formatTime(event.end)}
          </div>
        </div>
      </div>
    </div>
  );
}
