// Calendar event from Google Calendar (existing, read-only)
export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  source?: 'google'
}

// Agent-proposed event
export type ProposedEvent = {
  id: string
  taskId: string
  title: string
  start: Date
  end: Date
  status: 'proposed' | 'user-adjusted' | 'committed'
  reasoning?: string
}

// User task to schedule
export type Task = {
  id: string
  title: string
  duration: number // minutes
  deadline?: Date
  priority?: 'low' | 'medium' | 'high'
  dependsOn?: string // task id
}

// Chat message
export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

// Global scheduler state
export type SchedulerState = {
  status: 'idle' | 'inputting' | 'proposing' | 'adjusting' | 'committing'
  existingEvents: CalendarEvent[]
  tasks: Task[]
  proposedEvents: ProposedEvent[]
  messages: Message[]
}

// API response types
export type CommitResponse = {
  created: CalendarEvent[]
  errors: string[]
}

// Time slot for drag-drop
export type TimeSlot = {
  date: Date
  hour: number
  minute: number
}
