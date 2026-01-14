import { useEffect, useMemo, useState } from 'react'
import type { Trip, PlanItem, PackingItem, Expense } from '../types'
import { ensureDays, getTrip, loadTrips, upsertTrip } from '../storage'

interface Props {
  id: string
  onPrint: (id: string) => void
}

type Tab = 'itinerary' | 'packing' | 'expenses' | 'notes'

export default function TripEditor({ id, onPrint }: Props) {
  const [trips, setTrips] = useState<Trip[]>([])
  const trip = useMemo<Trip | undefined>(() => {
    const t = getTrip(trips, id)
    return t ? ensureDays(t) : undefined
  }, [trips, id])
  const [tab, setTab] = useState<Tab>('itinerary')

  useEffect(() => {
    setTrips(loadTrips())
  }, [])

  function save(t: Trip) {
    const next = upsertTrip(trips, t)
    setTrips(next)
  }

  if (!trip) {
    return (
      <div className="container">
        <header className="toolbar">
          <h2>旅行が見つかりません</h2>
        </header>
      </div>
    )
  }

  function updateTitle(title: string) {
    if (!trip) return
    save({ ...trip, title })
  }

  function updateDates(startDate: string, endDate: string) {
    if (!trip) return
    save(ensureDays({ ...trip, startDate, endDate }))
  }

  // Itinerary handlers
  function addPlanItem(dayIndex: number) {
    if (!trip) return
    const item: PlanItem = {
      id: Math.random().toString(36).slice(2, 10),
      title: '新しい予定',
      time: '',
      location: '',
      memo: '',
    }
    const days = [...trip.days]
    days[dayIndex] = { ...days[dayIndex], items: [...days[dayIndex].items, item] }
    save({ ...trip, days })
  }

  function updatePlanItem(dayIndex: number, itemId: string, patch: Partial<PlanItem>) {
    if (!trip) return
    const days = [...trip.days]
    const items = days[dayIndex].items.map(i => (i.id === itemId ? { ...i, ...patch } : i))
    days[dayIndex] = { ...days[dayIndex], items }
    save({ ...trip, days })
  }

  function removePlanItem(dayIndex: number, itemId: string) {
    if (!trip) return
    const days = [...trip.days]
    const items = days[dayIndex].items.filter(i => i.id !== itemId)
    days[dayIndex] = { ...days[dayIndex], items }
    save({ ...trip, days })
  }

  // Packing handlers
  function addPacking() {
    if (!trip) return
    const name = prompt('持ち物名') || '新しい持ち物'
    const item: PackingItem = { id: Math.random().toString(36).slice(2, 10), name, quantity: 1, packed: false }
    save({ ...trip, packing: [...trip.packing, item] })
  }
  function updatePacking(id: string, patch: Partial<PackingItem>) {
    if (!trip) return
    const packing = trip.packing.map(p => (p.id === id ? { ...p, ...patch } : p))
    save({ ...trip, packing })
  }
  function removePacking(id: string) {
    if (!trip) return
    const packing = trip.packing.filter(p => p.id !== id)
    save({ ...trip, packing })
  }

  // Expenses handlers
  function addExpense() {
    if (!trip) return
    const label = prompt('費目') || '新しい支出'
    const amountStr = prompt('金額', '0') || '0'
    const amount = parseInt(amountStr || '0', 10) || 0
    const exp: Expense = { id: Math.random().toString(36).slice(2, 10), label, amount }
    save({ ...trip, expenses: [...trip.expenses, exp] })
  }
  function updateExpense(id: string, patch: Partial<Expense>) {
    if (!trip) return
    const expenses = trip.expenses.map(e => (e.id === id ? { ...e, ...patch } : e))
    save({ ...trip, expenses })
  }
  function removeExpense(id: string) {
    if (!trip) return
    const expenses = trip.expenses.filter(e => e.id !== id)
    save({ ...trip, expenses })
  }

  const total = (trip?.expenses ?? []).reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <div className="container">
      <header className="toolbar">
        {/* Single-trip mode: no back to list */}
        <input className="title-input" value={trip.title} onChange={e => updateTitle(e.target.value)} />
        <div className="toolbar-actions">
          <input type="date" value={trip.startDate} onChange={e => updateDates(e.target.value, trip.endDate)} />
          <span>〜</span>
          <input type="date" value={trip.endDate} onChange={e => updateDates(trip.startDate, e.target.value)} />
          <button onClick={() => onPrint(trip.id)}>印刷</button>
        </div>
      </header>

      <nav className="tabs">
        {(
          [
            { key: 'itinerary', label: '日程' },
            { key: 'packing', label: '持ち物' },
            { key: 'expenses', label: '支出' },
            { key: 'notes', label: 'メモ' },
          ] as { key: Tab; label: string }[]
        ).map(t => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'itinerary' && (
        <section>
          {trip.days.map((d, idx) => (
            <div key={d.date} className="day">
              <div className="day-header">
                <h3>
                  Day {idx + 1} ({d.date})
                </h3>
                <button onClick={() => addPlanItem(idx)}>+ 予定</button>
              </div>
              <ul className="plan-list">
                {d.items.map(item => (
                  <li key={item.id} className="plan-item">
                    <input
                      className="time"
                      placeholder="時刻"
                      value={item.time || ''}
                      onChange={e => updatePlanItem(idx, item.id, { time: e.target.value })}
                    />
                    <input
                      className="title"
                      placeholder="タイトル"
                      value={item.title}
                      onChange={e => updatePlanItem(idx, item.id, { title: e.target.value })}
                    />
                    <input
                      className="location"
                      placeholder="場所"
                      value={item.location || ''}
                      onChange={e => updatePlanItem(idx, item.id, { location: e.target.value })}
                    />
                    <input
                      className="memo"
                      placeholder="メモ"
                      value={item.memo || ''}
                      onChange={e => updatePlanItem(idx, item.id, { memo: e.target.value })}
                    />
                    <button onClick={() => removePlanItem(idx, item.id)}>削除</button>
                  </li>
                ))}
                {d.items.length === 0 && <li className="empty">予定がありません</li>}
              </ul>
            </div>
          ))}
        </section>
      )}

      {tab === 'packing' && (
        <section>
          <div className="section-header">
            <button onClick={addPacking}>+ 追加</button>
          </div>
          <ul className="packing-list">
            {trip.packing.map(p => (
              <li key={p.id} className="packing-item">
                <input
                  type="checkbox"
                  checked={p.packed}
                  onChange={e => updatePacking(p.id, { packed: e.target.checked })}
                />
                <input
                  className="name"
                  value={p.name}
                  onChange={e => updatePacking(p.id, { name: e.target.value })}
                />
                <input
                  className="qty"
                  type="number"
                  value={p.quantity}
                  min={0}
                  onChange={e => updatePacking(p.id, { quantity: parseInt(e.target.value || '0', 10) || 0 })}
                />
                <button onClick={() => removePacking(p.id)}>削除</button>
              </li>
            ))}
            {trip.packing.length === 0 && <li className="empty">持ち物がありません</li>}
          </ul>
        </section>
      )}

      {tab === 'expenses' && (
        <section>
          <div className="section-header">
            <button onClick={addExpense}>+ 追加</button>
            <div className="total">合計: {total.toLocaleString()} 円</div>
          </div>
          <ul className="expense-list">
            {trip.expenses.map(e => (
              <li key={e.id} className="expense-item">
                <input
                  className="label"
                  value={e.label}
                  onChange={ev => updateExpense(e.id, { label: ev.target.value })}
                />
                <input
                  className="amount"
                  type="number"
                  value={e.amount}
                  onChange={ev => updateExpense(e.id, { amount: parseInt(ev.target.value || '0', 10) || 0 })}
                />
                <button onClick={() => removeExpense(e.id)}>削除</button>
              </li>
            ))}
            {trip.expenses.length === 0 && <li className="empty">支出がありません</li>}
          </ul>
        </section>
      )}

      {tab === 'notes' && (
        <section>
          <textarea
            className="notes"
            value={trip.notes}
            placeholder="メモを書く…"
            rows={12}
            onChange={e => save({ ...trip, notes: e.target.value })}
          />
        </section>
      )}
    </div>
  )
}
