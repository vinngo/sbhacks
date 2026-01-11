"use client";

import { useMemo } from "react";
import { cn, formatDate, formatDayOfWeek, isSameDay } from "@/lib/utils";
import { TimeSlot } from "./time-slot";
import { EventBlock } from "./event-block";
import { ProposedBlock } from "./proposed-block";
import type { CalendarEvent, ProposedEvent } from "@/lib/types";

type DayColumnProps = {
  date: Date;
  existingEvents: CalendarEvent[];
  proposedEvents: ProposedEvent[];
  startHour?: number;
  endHour?: number;
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
};

export function DayColumn({
  date,
  existingEvents,
  proposedEvents,
  startHour = 6,
  endHour = 22,
  onEventResize,
}: DayColumnProps) {
  const isToday = isSameDay(date, new Date());

  // Filter events for this day
  const dayExistingEvents = useMemo(
    () => existingEvents.filter((event) => isSameDay(event.start, date)),
    [existingEvents, date],
  );

  const dayProposedEvents = useMemo(
    () => proposedEvents.filter((event) => isSameDay(event.start, date)),
    [proposedEvents, date],
  );

  // Generate time slots (15-minute increments)
  const timeSlots = useMemo(() => {
    const slots: { hour: number; minute: number }[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  }, [startHour, endHour]);

  // Calculate total height based on hours
  const totalHours = endHour - startHour;
  const columnHeight = totalHours * 60; // 60px per hour

  return (
    <div 
      className="flex flex-col flex-1 min-w-0 border-r border-border"
      style={{ minHeight: `${60 + columnHeight}px` }}
    >
      {/* Day header */}
      <div
        className={cn(
          "h-[60px] flex flex-col items-center justify-center sticky top-0 bg-background z-10",
        )}
      >
        <div className="text-sm">{formatDayOfWeek(date)}</div>
        <div className={cn(
          "text-lg font-semibold flex items-center justify-center",
          isToday && "h-8 w-8 rounded-full bg-primary text-primary-foreground"
        )}>
          {formatDate(date).split(" ")[1]}
        </div>
      </div>

      {/* Time grid */}
      <div
        className="relative flex-1"
        style={{ height: `${columnHeight}px` }}
      >
        {/* Time slots (droppable zones) */}
        {timeSlots.map(({ hour, minute }) => (
          <TimeSlot
            key={`${date.toISOString()}-${hour}-${minute}`}
            id={`slot-${date.toISOString()}-${hour}-${minute}`}
            date={date}
            hour={hour}
            minute={minute}
          />
        ))}

        {/* Existing events */}
        {dayExistingEvents.map((event) => (
          <EventBlock 
            key={event.id} 
            event={event} 
            dayStartHour={startHour}
            onResize={onEventResize}
          />
        ))}

        {/* Proposed events (draggable) */}
        {dayProposedEvents.map((event) => (
          <ProposedBlock
            key={event.id}
            event={event}
            dayStartHour={startHour}
          />
        ))}
      </div>
    </div>
  );
}
