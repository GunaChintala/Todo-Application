import { useMemo, useState } from 'react'
import { formatLongDate, formatMonthYear, getMonthCells, isFutureDate, todayKey } from '../utils/dateUtils'
import { calculateDailyProgress, getDayStatus, isTaskCompletedOn, tasksRequiredOn } from '../utils/streakUtils'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DOT = { full: '🟢', partial: '🟡', none: '🔴' }

export default function CalendarView({ tasks, onToggle }) {
  const today = todayKey()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(today)

  const cells = useMemo(() => getMonthCells(year, month), [year, month])

  function shiftMonth(delta) {
    const next = new Date(year, month + delta, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  const required = tasksRequiredOn(tasks, selected)
  const progress = calculateDailyProgress(tasks, selected)
  const future = isFutureDate(selected)

  return (
    <section className="page">
      <div className="section-head">
        <div className="month-nav">
          <button className="btn ghost" onClick={() => shiftMonth(-1)}>
            ←
          </button>
          <strong>{formatMonthYear(year, month)}</strong>
          <button className="btn ghost" onClick={() => shiftMonth(1)}>
            →
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="cal-head">
            {day}
          </div>
        ))}
        {cells.map((dateKey, index) => {
          if (!dateKey) return <div key={`empty-${index}`} className="cal-cell empty" />
          const status = isFutureDate(dateKey) ? null : getDayStatus(tasks, dateKey)
          const isToday = dateKey === today
          const isSelected = dateKey === selected
          return (
            <button
              key={dateKey}
              className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelected(dateKey)}
            >
              <span>{Number(dateKey.slice(8))}</span>
              <span className="dot">{status ? DOT[status] : '·'}</span>
            </button>
          )
        })}
      </div>

      <article className="card">
        <h3>{formatLongDate(selected)}</h3>
        <p className="muted">
          {progress.completed}/{progress.total} completed
          {future ? ' · Future dates cannot be marked complete' : ''}
        </p>
        {required.length === 0 ? (
          <p className="empty-inline">No tasks existed on this day.</p>
        ) : (
          <ul className="day-tasks">
            {required.map((task) => {
              const done = isTaskCompletedOn(task, selected)
              return (
                <li key={task.id}>
                  <button
                    className={`check ${done ? 'checked' : ''}`}
                    disabled={future}
                    onClick={() => onToggle(task.id, selected)}
                  >
                    {done ? '✓' : ''}
                  </button>
                  <span>
                    {task.icon} {task.title}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </article>
    </section>
  )
}
