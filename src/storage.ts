import type { Trip, DayPlan } from './types'

const STORAGE_KEY = 'mytravel.trips'

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Trip[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTrips(trips: Trip[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export function getTrip(trips: Trip[], id: string): Trip | undefined {
  return trips.find(t => t.id === id)
}

export function upsertTrip(trips: Trip[], trip: Trip): Trip[] {
  const idx = trips.findIndex(t => t.id === trip.id)
  const next = [...trips]
  if (idx >= 0) next[idx] = trip
  else next.unshift(trip)
  saveTrips(next)
  return next
}

export function deleteTrip(trips: Trip[], id: string): Trip[] {
  const next = trips.filter(t => t.id !== id)
  saveTrips(next)
  return next
}

export function createTripId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function dateRange(start: string, end: string): string[] {
  const s = new Date(start)
  const e = new Date(end)
  const days: string[] = []
  const cur = new Date(s)
  while (cur <= e) {
    days.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

export function ensureDays(trip: Trip): Trip {
  const range = dateRange(trip.startDate, trip.endDate)
  const map = new Map(trip.days.map(d => [d.date, d]))
  const days: DayPlan[] = range.map(date => map.get(date) ?? { date, items: [] })
  return { ...trip, days }
}

export function createNewTrip(title = '新しい旅行', start?: string, end?: string): Trip {
  const today = new Date()
  const s = start ?? today.toISOString().slice(0, 10)
  const eDate = new Date(s)
  eDate.setDate(eDate.getDate() + 2)
  const e = end ?? eDate.toISOString().slice(0, 10)
  const base: Trip = {
    id: createTripId(),
    title,
    startDate: s,
    endDate: e,
    days: [],
    packing: [],
    expenses: [],
    notes: '',
  }
  return ensureDays(base)
}

export function exportTrips(trips: Trip[]): string {
  return JSON.stringify(trips, null, 2)
}

export function importTripsJson(json: string): Trip[] {
  const parsed = JSON.parse(json) as Trip[]
  if (!Array.isArray(parsed)) throw new Error('Invalid JSON')
  // Basic normalization
  const normalized = parsed.map(t => ensureDays(t))
  saveTrips(normalized)
  return normalized
}

// Single-trip convenience: ensure one trip exists and return it
export function getOrCreateSingleTrip(): Trip {
  const trips = loadTrips()
  if (trips.length > 0) {
    const first = ensureDays(trips[0])
    // keep storage normalized
    saveTrips([first])
    return first
  }
  const created = createNewTrip()
  saveTrips([created])
  return created
}
