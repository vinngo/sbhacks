"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSchedulerContext } from "@/context/scheduler-context";
import { fetchEvents, commitEvents } from "@/lib/api";
import { USE_MOCK_DATA, mockCalendarEvents } from "@/lib/mock-data";
import { formatFullDate, getWeekRange } from "@/lib/utils";
import type { ProposedEvent, CalendarEvent } from "@/lib/types";
import { useEffect } from "react";

export function useCalendarEvents(weekDate: Date) {
  const { start, end } = getWeekRange(weekDate);
  const { setExistingEvents } = useSchedulerContext();

  const query = useQuery({
    queryKey: ["calendar", formatFullDate(start), formatFullDate(end)],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockCalendarEvents;
      }
      return fetchEvents(start.toISOString(), end.toISOString());
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync query data with context
  useEffect(() => {
    if (query.data) {
      setExistingEvents(query.data);
    }
  }, [query.data, setExistingEvents]);

  return query;
}

export function useCommitEvents() {
  const queryClient = useQueryClient();
  const { setProposedEvents, setStatus } = useSchedulerContext();

  return useMutation({
    mutationFn: async (events: ProposedEvent[]) => {
      if (USE_MOCK_DATA) {
        // Simulate commit
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          created: events.map((e) => ({
            id: `committed-${e.id}`,
            title: e.title,
            start: e.start,
            end: e.end,
            source: "google" as const,
          })),
          errors: [],
        };
      }
      return commitEvents(events);
    },
    onMutate: () => {
      setStatus("committing");
    },
    onSuccess: (data) => {
      // Mark events as committed
      setProposedEvents([]);
      // Invalidate calendar query to refetch
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      setStatus("idle");
    },
    onError: () => {
      setStatus("adjusting");
    },
  });
}

// Helper to check for conflicts between events
export function useConflictCheck() {
  const { existingEvents, proposedEvents } = useSchedulerContext();

  const checkConflict = (event: ProposedEvent): boolean => {
    const allEvents = [
      ...existingEvents,
      ...proposedEvents.filter((e) => e.id !== event.id),
    ];

    return allEvents.some((other) => {
      const otherStart = other.start.getTime();
      const otherEnd = other.end.getTime();
      const eventStart = event.start.getTime();
      const eventEnd = event.end.getTime();

      // Check for overlap
      return eventStart < otherEnd && eventEnd > otherStart;
    });
  };

  const getConflicts = (): ProposedEvent[] => {
    return proposedEvents.filter(checkConflict);
  };

  return { checkConflict, getConflicts };
}
