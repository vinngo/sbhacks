"use client";

import { useState } from "react";
import { cn, formatTime, getEventPosition } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";

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

  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        className="absolute left-1 right-1"
        style={{ top: `${top}px`, height: `${height}px` }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Event content */}
        <div
          className={cn(
            "h-full rounded-md px-2 py-1 overflow-hidden",
            "bg-[var(--event-existing)] text-[var(--event-existing-text)]",
            "text-xs font-medium cursor-default"
          )}
        >
          {/* Event title */}
          <div className="truncate font-medium font-serif">{event.title}</div>

          {/* Time */}
          {height > 30 && (
            <div className="truncate text-[10px] opacity-75">
              {formatTime(event.start)} – {formatTime(event.end)}
            </div>
          )}
        </div>
      </div>

      {/* Cursor-following tooltip */}
      {isHovering && (
        <div
          className={cn(
            "fixed z-[100] pointer-events-none",
            "rounded-md px-3 py-2 whitespace-nowrap",
            "bg-black/90 text-white text-xs shadow-lg",
            "animate-in fade-in duration-150"
          )}
          style={{
            left: `${mousePos.x + 12}px`,
            top: `${mousePos.y + 12}px`,
          }}
        >
          <div className="font-semibold">{event.title}</div>
          <div className="text-[10px] opacity-75 mt-0.5">
            {formatTime(event.start)} – {formatTime(event.end)}
          </div>
        </div>
      )}
    </>
  );
}
