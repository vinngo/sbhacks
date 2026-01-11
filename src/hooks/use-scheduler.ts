'use client'

import { useCallback } from 'react'
import { useSchedulerContext } from '@/context/scheduler-context'
import type { ProposedEvent } from '@/lib/types'
import { addDays } from '@/lib/utils'

export function useScheduler() {
  const {
    proposedEvents,
    tasks,
    status,
    updateProposedEvent,
    setProposedEvents,
    clearProposals,
    setStatus,
  } = useSchedulerContext()

  // Move an event to a new time slot
  const moveEvent = useCallback(
    (id: string, newStart: Date, newEnd: Date) => {
      updateProposedEvent(id, {
        start: newStart,
        end: newEnd,
        status: 'user-adjusted',
      })
    },
    [updateProposedEvent]
  )

  // Lock an event (mark as user-adjusted so agent won't move it)
  const lockEvent = useCallback(
    (id: string) => {
      updateProposedEvent(id, { status: 'user-adjusted' })
    },
    [updateProposedEvent]
  )

  // Unlock an event (allow agent to reschedule it)
  const unlockEvent = useCallback(
    (id: string) => {
      updateProposedEvent(id, { status: 'proposed' })
    },
    [updateProposedEvent]
  )

  // Resize an event (change duration)
  const resizeEvent = useCallback(
    (id: string, newEnd: Date) => {
      updateProposedEvent(id, {
        end: newEnd,
        status: 'user-adjusted',
      })
    },
    [updateProposedEvent]
  )

  // Get event by ID
  const getEventById = useCallback(
    (id: string): ProposedEvent | undefined => {
      return proposedEvents.find(event => event.id === id)
    },
    [proposedEvents]
  )

  // Check if there are any proposals
  const hasProposals = proposedEvents.length > 0

  // Check if there are uncommitted proposals
  const hasUncommittedProposals = proposedEvents.some(
    event => event.status !== 'committed'
  )

  // Get only proposed (not user-adjusted) events
  const getProposedOnly = useCallback(() => {
    return proposedEvents.filter(event => event.status === 'proposed')
  }, [proposedEvents])

  // Get user-adjusted events
  const getUserAdjusted = useCallback(() => {
    return proposedEvents.filter(event => event.status === 'user-adjusted')
  }, [proposedEvents])

  return {
    proposedEvents,
    tasks,
    status,
    moveEvent,
    lockEvent,
    unlockEvent,
    resizeEvent,
    getEventById,
    hasProposals,
    hasUncommittedProposals,
    getProposedOnly,
    getUserAdjusted,
    setProposedEvents,
    clearProposals,
    setStatus,
  }
}
