'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  CalendarEvent,
  ProposedEvent,
  Task,
  Message,
  SchedulerState,
} from '@/lib/types'

type SchedulerContextValue = {
  // State
  status: SchedulerState['status']
  existingEvents: CalendarEvent[]
  proposedEvents: ProposedEvent[]
  tasks: Task[]
  messages: Message[]
  isStreaming: boolean
  currentWeek: Date

  // Actions
  setExistingEvents: (events: CalendarEvent[]) => void
  setProposedEvents: (
    eventsOrUpdater: ProposedEvent[] | ((prev: ProposedEvent[]) => ProposedEvent[])
  ) => void
  updateProposedEvent: (id: string, updates: Partial<ProposedEvent>) => void
  addProposedEvent: (event: ProposedEvent) => void
  removeProposedEvent: (id: string) => void
  clearProposals: () => void
  setTasks: (tasks: Task[]) => void
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  setIsStreaming: (streaming: boolean) => void
  setStatus: (status: SchedulerState['status']) => void
  setCurrentWeek: (date: Date) => void

  // Computed
  getProposalState: () => {
    existingEvents: CalendarEvent[]
    proposedEvents: ProposedEvent[]
    tasks: Task[]
  }
}

const SchedulerContext = createContext<SchedulerContextValue | null>(null)

export function SchedulerProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SchedulerState['status']>('idle')
  const [existingEvents, setExistingEvents] = useState<CalendarEvent[]>([])
  const [proposedEvents, setProposedEvents] = useState<ProposedEvent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const updateProposedEvent = useCallback(
    (id: string, updates: Partial<ProposedEvent>) => {
      setProposedEvents(prev =>
        prev.map(event =>
          event.id === id
            ? { ...event, ...updates, status: 'user-adjusted' as const }
            : event
        )
      )
    },
    []
  )

  const addProposedEvent = useCallback((event: ProposedEvent) => {
    setProposedEvents(prev => [...prev, event])
  }, [])

  const removeProposedEvent = useCallback((id: string) => {
    setProposedEvents(prev => prev.filter(event => event.id !== id))
  }, [])

  const clearProposals = useCallback(() => {
    setProposedEvents([])
    setTasks([])
    setStatus('idle')
  }, [])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const updateLastMessage = useCallback((content: string) => {
    setMessages(prev => {
      if (prev.length === 0) return prev
      const updated = [...prev]
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content,
      }
      return updated
    })
  }, [])

  const getProposalState = useCallback(
    () => ({
      existingEvents,
      proposedEvents,
      tasks,
    }),
    [existingEvents, proposedEvents, tasks]
  )

  return (
    <SchedulerContext.Provider
      value={{
        status,
        existingEvents,
        proposedEvents,
        tasks,
        messages,
        isStreaming,
        currentWeek,
        setExistingEvents,
        setProposedEvents,
        updateProposedEvent,
        addProposedEvent,
        removeProposedEvent,
        clearProposals,
        setTasks,
        addMessage,
        updateLastMessage,
        setIsStreaming,
        setStatus,
        setCurrentWeek,
        getProposalState,
      }}
    >
      {children}
    </SchedulerContext.Provider>
  )
}

export function useSchedulerContext() {
  const context = useContext(SchedulerContext)
  if (!context) {
    throw new Error('useSchedulerContext must be used within SchedulerProvider')
  }
  return context
}
