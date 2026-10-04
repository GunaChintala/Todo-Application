import ProgressBar from './ProgressBar'
import StreakCard from './StreakCard'
import { weekdayShort } from '../utils/dateUtils'

export default function Statistics({ tasks, stats }) {
  const { daily, overall, week, totalCompleted } = stats
  const overallRate =
    tasks.length === 0
      ? 0
      : Math.round(tasks.reduce((sum, task) => sum + task.completionRate, 0) / tasks.length)

  return (
    <section className="page">
      <div className="stat-grid">
        <article className="stat-card">
          <p className="stat-kicker">Total Tasks</p>
          <p className="stat-value">{tasks.length}</p>
        </article>
        <article className="stat-card">
          <p className="stat-kicker">Completed Today</p>
          <p className="stat-value">
            {daily.completed}/{daily.total}
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-kicker">Completion Rate</p>
          <p className="stat-value">{overallRate}%</p>
        </article>
        <article className="stat-card">
          <p className="stat-kicker">Total Completed</p>
          <p className="stat-value">{totalCompleted}</p>
        </article>
      </div>

      <StreakCard current={overall.current} longest={overall.longest} />

      <article className="card">
        <h3>Weekly completion</h3>
        <div className="week-chart">
          {week.map((day) => (
            <div key={day.dateKey} className="chart-row">
              <span>{weekdayShort(day.dateKey)}</span>
              <ProgressBar value={day.percent} label={`${day.percent}%`} />
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
