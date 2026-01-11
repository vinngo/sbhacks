import type {
  CalendarEvent,
  ProposedEvent,
  Message,
  SchedulerState,
  CommitResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch calendar events for a date range
export async function fetchEvents(
  start: string,
  end: string,
): Promise<CalendarEvent[]> {
  const res = await fetch(
    `/api/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch calendar events");
  }
  const data = await res.json();
  // Convert date strings back to Date objects
  return data.map((event: CalendarEvent & { start: string; end: string }) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
}

// Commit proposed events to calendar
export async function commitEvents(
  events: ProposedEvent[],
): Promise<CommitResponse> {
  const res = await fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(events),
  });
  if (!res.ok) {
    throw new Error("Failed to commit events");
  }
  return res.json();
}

// Stream chat response
export async function* streamChat(
  messages: Message[],
  state: SchedulerState,
): AsyncGenerator<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      })),
      proposal_state: {
        existing_events: state.existingEvents.map((e) => ({
          id: e.id,
          title: e.title,
          start: e.start.toISOString(),
          end: e.end.toISOString(),
          source: e.source,
        })),
        proposed_events: state.proposedEvents.map((e) => ({
          id: e.id,
          taskId: e.taskId,
          title: e.title,
          start: e.start.toISOString(),
          end: e.end.toISOString(),
          status: e.status,
          reasoning: e.reasoning,
        })),
        tasks: state.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          duration: t.duration,
          deadline: t.deadline?.toISOString(),
          priority: t.priority,
          dependsOn: t.dependsOn,
        })),
      },
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to send chat message");
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

// Parse proposed events from assistant message
export function parseProposedEvents(content: string): ProposedEvent[] | null {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    // Convert date strings to Date objects
    return parsed.map(
      (event: ProposedEvent & { start: string; end: string }) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }),
    );
  } catch {
    console.error("Failed to parse proposed events JSON");
    return null;
  }
}
