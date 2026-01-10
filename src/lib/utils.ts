import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  differenceInMinutes,
  setHours,
  setMinutes,
} from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting helpers
export function formatTime(date: Date): string {
  return format(date, "h:mm a")
}

export function formatDate(date: Date): string {
  return format(date, "MMM d")
}

export function formatDayOfWeek(date: Date): string {
  return format(date, "EEE")
}

export function formatFullDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

// Week navigation
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }) // Sunday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  }
}

// Calendar positioning
export function getEventPosition(
  start: Date,
  end: Date,
  dayStart: number = 6 // 6am
): { top: number; height: number } {
  const startHour = start.getHours() + start.getMinutes() / 60
  const endHour = end.getHours() + end.getMinutes() / 60
  const duration = endHour - startHour

  // Each hour is 60px (adjust as needed)
  const hourHeight = 60
  const top = (startHour - dayStart) * hourHeight
  const height = duration * hourHeight

  return { top: Math.max(0, top), height: Math.max(15, height) }
}

// Time slot helpers
export function getTimeSlotDate(date: Date, hour: number, minute: number): Date {
  return setMinutes(setHours(date, hour), minute)
}

export function roundToNearest15(date: Date): Date {
  const minutes = date.getMinutes()
  const rounded = Math.round(minutes / 15) * 15
  return setMinutes(date, rounded === 60 ? 0 : rounded)
}

// Event duration
export function getEventDurationMinutes(start: Date, end: Date): number {
  return differenceInMinutes(end, start)
}

export { isSameDay, addDays }
