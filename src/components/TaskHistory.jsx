import { useMemo, useState } from 'react'
import { eachDateKey, formatMonthYear, parseDateKey, todayKey } from '../utils/dateUtils'
import { calculateTaskStats, isTaskCompletedOn } from '../utils/streakUtils'
import ProgressBar from './ProgressBar'
import StreakCard from './StreakCard'

export default function TaskHistory({ task, onBack, onToggle }) {
  const today = todayKey()
  const created = parseDateKey(task.createdAt)
  const [year, setYear] = useState(created.getFullYear())
  const [month, setMonth] = useState(created.getMonth())
  const stats = calculateTaskStats(task, today)

  const monthKeys = useMemo(() => {
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    const from = start < task.createdAt ? task.createdAt : start
    const to = end > today ? today : end
    if (from > to) return []
    return eachDateKey(from, to)
  }, [year, month, task.createdAt, today])

  function shiftMonth(delta) {
    const next = new Date(year, month + delta, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  return (
    <section className="page">
      <button className="btn ghost" onClick={onBack}>
        ← Back
      </button>
      <div className="hero-card">
        <p className="eyebrow">
          {task.icon} {task.category}
        </p>
        <h2>{task.title}</h2>
        {task.description ? <p className="muted">{task.description}</p> : null}
      </div>

      <StreakCard current={task.currentStreak} longest={task.longestStreak} />

      <article className="card">
        <h3>Completion Rate</h3>
        <ProgressBar value={stats.completionRate} label={`${stats.completionRate}%`} />
        <p className="muted">
          {stats.completedDays} completed · {stats.missedDays} missed · {stats.trackedDays} tracked days
        </p>
      </article>

      <article className="card">
        <div className="section-head">
          <h3>{formatMonthYear(year, month)}</h3>
          <div className="month-nav">
            <button className="btn ghost" onClick={() => shiftMonth(-1)}>
              ←
            </button>
            <button className="btn ghost" onClick={() => shiftMonth(1)}>
              →
            </button>
          </div>
        </div>
        <div className="history-dots">
          {monthKeys.length === 0 ? (
            <p className="muted">No history in this month.</p>
          ) : (
            monthKeys.map((dateKey) => {
              const done = isTaskCompletedOn(task, dateKey)
              return (
                <button
                  key={dateKey}
                  className={`history-dot ${done ? 'checked' : ''}`}
                  title={dateKey}
                  onClick={() => onToggle(task.id, dateKey)}
                >
                  {done ? '✓' : '✗'}
                </button>
              )
            })
          )}
        </div>
      </article>
    </section>
  )
}
