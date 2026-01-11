"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);

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
    <motion.div
      ref={setNodeRef}
      className={cn(
        "absolute left-1 right-1 rounded-md px-2",
        "bg-gray-200 text-foreground",
        "text-[10px] font-medium overflow-hidden",
        "cursor-grab",
        "border border-border",
        isCompact ? "py-0.5 flex items-center" : "py-1",
        isDragging && "opacity-50 z-50 cursor-grabbing",
      )}
      style={style}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        y: isHovered ? -2 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
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
    </motion.div>
  );
}
