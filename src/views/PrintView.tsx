import { useEffect, useMemo, useState } from 'react'
import type { Trip } from '../types'
import { ensureDays, getTrip, loadTrips } from '../storage'

interface Props {
  id: string
}

export default function PrintView({ id }: Props) {
  const [trips, setTrips] = useState<Trip[]>([])
  const trip = useMemo(() => {
    const t = getTrip(trips, id)
    return t ? ensureDays(t) : undefined
  }, [trips, id])

  useEffect(() => {
    setTrips(loadTrips())
  }, [])

  if (!trip) {
    return (
      <div className="container">
        <header className="toolbar">
          <h2>旅行が見つかりません</h2>
        </header>
      </div>
    )
  }

  return (
    <div className="print-container">
      <header className="print-header">
        <button onClick={() => window.print()}>印刷</button>
      </header>

      <section className="print-trip">
        <h1>{trip.title}</h1>
        <div className="dates">
          {trip.startDate} 〜 {trip.endDate}
        </div>
      </section>

      {trip.days.map((d, idx) => (
        <section key={d.date} className="print-day">
          <h2>
            Day {idx + 1} ({d.date})
          </h2>
          <ul>
            {d.items.map(i => (
              <li key={i.id}>
                <div className="time">{i.time}</div>
                <div className="title">{i.title}</div>
                <div className="location">{i.location}</div>
                {i.memo && <div className="memo">{i.memo}</div>}
              </li>
            ))}
            {d.items.length === 0 && <li className="empty">予定なし</li>}
          </ul>
        </section>
      ))}
    </div>
  )
}
