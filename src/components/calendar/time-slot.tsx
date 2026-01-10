"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

type TimeSlotProps = {
  id: string;
  date: Date;
  hour: number;
  minute: number;
};

export function TimeSlot({ id, date, hour, minute }: TimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { date, hour, minute },
  });

  // Only show border on the hour, not on 15/30/45 minute marks
  const isHourMark = minute === 0;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-[15px] w-full",
        isHourMark && "border-t border-[var(--time-grid-line)]",
        isOver && "bg-[var(--slot-hover)]",
      )}
      data-hour={hour}
      data-minute={minute}
    />
  );
}
