import { addDays, setHours, setMinutes, startOfWeek } from "date-fns";
import type { CalendarEvent, ProposedEvent, Task, Message } from "./types";

// Toggle this to switch between mock data and real API
export const USE_MOCK_DATA = true;

// Get the start of the current week for consistent mock data
const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });

function createDate(dayOffset: number, hour: number, minute: number = 0): Date {
  return setMinutes(setHours(addDays(weekStart, dayOffset), hour), minute);
}

// Sample existing calendar events (from "Google Calendar")
export const mockCalendarEvents: CalendarEvent[] = [
  // Monday - Packed day
  {
    id: "event-1",
    title: "Morning Workout",
    start: createDate(1, 7, 0),
    end: createDate(1, 8, 30),
    source: "google",
  },
  {
    id: "event-2",
    title: "Team Standup",
    start: createDate(1, 9, 0),
    end: createDate(1, 9, 30),
    source: "google",
  },
  {
    id: "event-3",
    title: "CS 201 Algorithms",
    start: createDate(1, 10, 0),
    end: createDate(1, 12, 0),
    source: "google",
  },
  {
    id: "event-4",
    title: "Lunch Break",
    start: createDate(1, 12, 0),
    end: createDate(1, 13, 0),
    source: "google",
  },
  {
    id: "event-5",
    title: "Product Review Meeting",
    start: createDate(1, 14, 0),
    end: createDate(1, 16, 0),
    source: "google",
  },
  {
    id: "event-6",
    title: "Office Hours",
    start: createDate(1, 16, 30),
    end: createDate(1, 17, 30),
    source: "google",
  },

  // Tuesday - Classes and meetings
  {
    id: "event-7",
    title: "Data Structures Lab",
    start: createDate(2, 9, 0),
    end: createDate(2, 11, 0),
    source: "google",
  },
  {
    id: "event-8",
    title: "CS 101 Lecture",
    start: createDate(2, 11, 30),
    end: createDate(2, 13, 0),
    source: "google",
  },
  {
    id: "event-9",
    title: "Lunch with Sarah",
    start: createDate(2, 13, 0),
    end: createDate(2, 14, 0),
    source: "google",
  },
  {
    id: "event-10",
    title: "Research Group",
    start: createDate(2, 14, 30),
    end: createDate(2, 16, 0),
    source: "google",
  },
  {
    id: "event-11",
    title: "Basketball Practice",
    start: createDate(2, 17, 0),
    end: createDate(2, 19, 0),
    source: "google",
  },

  // Wednesday - Mixed schedule
  {
    id: "event-12",
    title: "Gym Session",
    start: createDate(3, 7, 0),
    end: createDate(3, 8, 30),
    source: "google",
  },
  {
    id: "event-13",
    title: "Web Dev Workshop",
    start: createDate(3, 10, 0),
    end: createDate(3, 12, 30),
    source: "google",
  },
  {
    id: "event-14",
    title: "Career Fair",
    start: createDate(3, 13, 0),
    end: createDate(3, 15, 0),
    source: "google",
  },
  {
    id: "event-15",
    title: "Project Team Meeting",
    start: createDate(3, 15, 30),
    end: createDate(3, 17, 30),
    source: "google",
  },

  // Thursday - Back-to-back classes
  {
    id: "event-16",
    title: "Machine Learning Lecture",
    start: createDate(4, 9, 0),
    end: createDate(4, 10, 30),
    source: "google",
  },
  {
    id: "event-17",
    title: "Dentist Appointment",
    start: createDate(4, 11, 0),
    end: createDate(4, 12, 30),
    source: "google",
  },
  {
    id: "event-18",
    title: "Database Systems",
    start: createDate(4, 13, 0),
    end: createDate(4, 15, 0),
    source: "google",
  },
  {
    id: "event-19",
    title: "TA Sessions",
    start: createDate(4, 15, 30),
    end: createDate(4, 17, 30),
    source: "google",
  },
  {
    id: "event-20",
    title: "Study Group",
    start: createDate(4, 18, 0),
    end: createDate(4, 20, 0),
    source: "google",
  },

  // Friday - Wind down
  {
    id: "event-21",
    title: "Systems Seminar",
    start: createDate(5, 9, 0),
    end: createDate(5, 11, 0),
    source: "google",
  },
  {
    id: "event-22",
    title: "Coffee with Mentor",
    start: createDate(5, 11, 30),
    end: createDate(5, 12, 30),
    source: "google",
  },
  {
    id: "event-23",
    title: "Hackathon Prep",
    start: createDate(5, 14, 0),
    end: createDate(5, 17, 0),
    source: "google",
  },

  // Weekend events
  {
    id: "event-24",
    title: "Volunteer Work",
    start: createDate(6, 10, 0),
    end: createDate(6, 14, 0),
    source: "google",
  },
  {
    id: "event-25",
    title: "Family Dinner",
    start: createDate(0, 18, 0),
    end: createDate(0, 20, 0),
    source: "google",
  },
];

// Sample proposed events (from the AI agent)
export const mockProposedEvents: ProposedEvent[] = [
  {
    id: "proposed-1",
    taskId: "task-1",
    title: "Essay Writing",
    start: createDate(1, 10, 0), // Monday 10:00 AM
    end: createDate(1, 12, 0),
    status: "proposed",
    reasoning: "Morning slot after standup - best for focused work",
  },
  {
    id: "proposed-2",
    taskId: "task-2",
    title: "Study for Quiz",
    start: createDate(2, 14, 0), // Tuesday 2:00 PM
    end: createDate(2, 15, 30),
    status: "proposed",
    reasoning: "After lunch, before afternoon fatigue",
  },
  {
    id: "proposed-3",
    taskId: "task-3",
    title: "Interview Prep",
    start: createDate(4, 9, 0), // Thursday 9:00 AM
    end: createDate(4, 10, 30),
    status: "user-adjusted",
    reasoning: "User moved from Wednesday to Thursday morning",
  },
];

// Sample tasks (user input)
export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Essay Writing",
    duration: 120, // 2 hours
    deadline: createDate(3, 23, 59), // Wednesday EOD
    priority: "high",
  },
  {
    id: "task-2",
    title: "Study for Quiz",
    duration: 90, // 1.5 hours
    deadline: createDate(4, 8, 0), // Thursday morning
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Interview Prep",
    duration: 90,
    priority: "high",
  },
];

// Sample chat messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    role: "user",
    content:
      "I need to schedule 2 hours for essay writing, 1.5 hours for quiz prep, and 1.5 hours for interview prep this week.",
    timestamp: new Date(),
  },
  {
    id: "msg-2",
    role: "assistant",
    content: `I've analyzed your calendar and found some good slots for your tasks. Here's what I propose:

\`\`\`json
[
  {
    "id": "proposed-1",
    "taskId": "task-1",
    "title": "Essay Writing",
    "start": "${createDate(1, 10, 0).toISOString()}",
    "end": "${createDate(1, 12, 0).toISOString()}",
    "status": "proposed",
    "reasoning": "Morning slot after standup - best for focused work"
  },
  {
    "id": "proposed-2",
    "taskId": "task-2",
    "title": "Study for Quiz",
    "start": "${createDate(2, 14, 0).toISOString()}",
    "end": "${createDate(2, 15, 30).toISOString()}",
    "status": "proposed",
    "reasoning": "After lunch, before afternoon fatigue"
  }
]
\`\`\`

**Essay Writing** is scheduled Monday morning (10 AM - 12 PM) right after your standup. This gives you a 2-hour focused block while you're still fresh.

**Quiz Study** is placed Tuesday afternoon (2 - 3:30 PM). You have a gap after lunch that's perfect for review.

Feel free to drag any of these to adjust, or tell me if you'd like different times!`,
    timestamp: new Date(),
  },
];

// Mock streaming response for chat
export async function* mockStreamChat(): AsyncGenerator<string> {
  const response = `I'll find the best times for your tasks. Let me check your calendar...

Based on your existing commitments, here are my suggestions:

\`\`\`json
[
  {
    "id": "proposed-new-1",
    "taskId": "task-new",
    "title": "New Task",
    "start": "${createDate(3, 10, 0).toISOString()}",
    "end": "${createDate(3, 11, 30).toISOString()}",
    "status": "proposed",
    "reasoning": "Wednesday morning has a clear block"
  }
]
\`\`\`

I've scheduled your task for Wednesday morning when you have free time after the gym. Let me know if you'd like to adjust!`;

  // Simulate streaming by yielding chunks
  const chunks = response.split(" ");
  for (const chunk of chunks) {
    yield chunk + " ";
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}
