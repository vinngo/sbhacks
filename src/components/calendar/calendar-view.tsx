"use client";

import { useCallback } from "react";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { cn, getWeekDays, getTimeSlotDate, formatTime } from "@/lib/utils";
import { DayColumn } from "./day-column";
import { useSchedulerContext } from "@/context/scheduler-context";
import { useScheduler } from "@/hooks/use-scheduler";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";

type CalendarViewProps = {
  startHour?: number;
  endHour?: number;
};

export function CalendarView({
  startHour = 0,
  endHour = 24,
}: CalendarViewProps) {
  const { existingEvents, proposedEvents, currentWeek, setCurrentWeek } =
    useSchedulerContext();
  const { moveEvent } = useScheduler();

  const weekDays = getWeekDays(currentWeek);
  const totalHours = endHour - startHour;

  // Handle drag end - move event to new time slot
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !active.data.current?.event) return;

      const draggedEvent = active.data.current.event;
      const dropData = over.data.current as {
        date: Date;
        hour: number;
        minute: number;
      };

      if (!dropData) return;

      // Calculate new start and end times
      const duration =
        draggedEvent.end.getTime() - draggedEvent.start.getTime();
      const newStart = getTimeSlotDate(
        dropData.date,
        dropData.hour,
        dropData.minute,
      );
      const newEnd = new Date(newStart.getTime() + duration);

      moveEvent(draggedEvent.id, newStart, newEnd);
    },
    [moveEvent],
  );

  // Week navigation
  const goToPreviousWeek = () => setCurrentWeek(addDays(currentWeek, -7));
  const goToNextWeek = () => setCurrentWeek(addDays(currentWeek, 7));
  const goToToday = () => setCurrentWeek(new Date());

  // Generate hour labels
  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Calendar header with navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-serif">
          {weekDays[0].toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      {/* Calendar grid */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-auto">
          {/* Day columns */}
          <div className="flex flex-1 min-w-0">
            <div className="flex flex-col w-16 border-r border-border">
              {/* Empty header space */}
              <div>
                <div className="h-[49px] border-b border-border" />
                {/* Hour labels */}
                <div className="">
                  {hours.map((hour, index) => (
                    <div
                      key={hour}
                      className="h-[60px] text-xs text-muted-foreground pr-2 relative"
                    >
                      <span className="top-0 right-2 -translate-y-1/2">
                        {formatTime(
                          new Date().setHours(hour, 0, 0, 0) as unknown as Date,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {weekDays.map((date) => (
              <DayColumn
                key={date.toISOString()}
                date={date}
                existingEvents={existingEvents}
                proposedEvents={proposedEvents}
                startHour={startHour}
                endHour={endHour}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
