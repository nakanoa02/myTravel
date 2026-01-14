import { useState } from 'react'

type PlanItem = {
  photoUrl?: string
  title: string
  startTime: string // HH:MM
  endTime: string // HH:MM
  place: string
  tags?: string[]
  importance?: 'main' | 'minor'
}

type Day = {
  date: string // YYYY-MM-DD
  items: PlanItem[]
}

const itinerary: Day[] = [
  {
    date: '2025-03-20',
    items: [
      {
        photoUrl: '/images/placeholder.svg',
        title: '朝食カフェ',
        startTime: '08:30',
        endTime: '09:30',
        place: '中目黒 Cafe A',
        tags: ['food', 'cafe']
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: '電車で移動',
        startTime: '09:30',
        endTime: '10:00',
        place: '中目黒駅 → 代々木駅',
        tags: ['move'],
        importance: 'minor'
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: '美術館',
        startTime: '10:00',
        endTime: '12:00',
        place: '東京都現代美術館',
        tags: ['art', 'museum']
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: 'ランチ',
        startTime: '12:30',
        endTime: '13:30',
        place: '銀座 Restaurant B',
        tags: ['food']
      },
    ],
  },
  {
    date: '2025-03-21',
    items: [
      {
        photoUrl: '/images/placeholder.svg',
        title: '散策',
        startTime: '09:00',
        endTime: '11:00',
        place: '浅草〜上野エリア',
        tags: ['walk']
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: 'スイーツタイム',
        startTime: '15:00',
        endTime: '16:00',
        place: '表参道 パティスリー C',
        tags: ['dessert', 'cafe']
      },
    ],
  },
]

function compareTime(a: string, b: string) {
  return a.localeCompare(b)
}

export default function TravelPage() {
  const [showMinor, setShowMinor] = useState(false)
  return (
    <main className="page">
      <header className="page-header">
        <h1>旅行プラン</h1>
        <div className="filter-row">
          <label className="toggle">
            <span className="toggle-label">補助項目を表示する</span>
            <input
              type="checkbox"
              className="toggle-input"
              checked={showMinor}
              onChange={(e) => setShowMinor(e.target.checked)}
            />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
          </label>
        </div>
      </header>

      {itinerary.map((day) => (
        <section key={day.date} className="day">
          <h2 className="day-title">
            <time dateTime={day.date}>{day.date}</time>
          </h2>
          <ul className="cards">
            {[...day.items]
              .filter((it) => showMinor || it.importance !== 'minor')
              .sort((i1, i2) => compareTime(i1.startTime, i2.startTime))
              .map((item, idx) => (
              <li key={day.date + '-' + idx} className="card">
                <div className="card-img">
                  {item.photoUrl ? (
                    <img src={item.photoUrl} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="img-placeholder" aria-label={item.title} />
                  )}
                </div>
                <div className="card-body">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="meta-row">
                    <ClockIcon />
                    <span className="time-range">
                      <time dateTime={item.startTime}>{item.startTime}</time>
                      {' '}–{' '}
                      <time dateTime={item.endTime}>{item.endTime}</time>
                    </span>
                  </div>
                  <div className="meta-row">
                    <PinIcon />
                    <span className="place">{item.place}</span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="tags">
                      {item.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

function ClockIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}
