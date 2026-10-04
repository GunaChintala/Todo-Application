import { greetingForNow, formatLongDate } from '../utils/dateUtils'
import ProgressBar from './ProgressBar'
import StreakCard from './StreakCard'
import TaskList from './TaskList'

export default function Dashboard({
  tasks,
  stats,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
  onCreate,
}) {
  const { today, daily, overall } = stats

  return (
    <section className="page">
      <div className="hero-card">
        <p className="eyebrow">{greetingForNow()} 👋</p>
        <h2>{formatLongDate(today)}</h2>
        <p className="muted">Today&apos;s Progress</p>
        <ProgressBar value={daily.percent} label={`${daily.percent}%`} />
        <p className="hero-count">
          {daily.completed} / {daily.total} Tasks Completed
        </p>
      </div>

      <StreakCard current={overall.current} longest={overall.longest} />

      <div className="section-head">
        <h3>Today&apos;s Tasks</h3>
        <button className="btn primary" onClick={onCreate}>
          + New task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        dateKey={today}
        emptyMessage="Create your first habit to start a streak."
        onToggle={onToggle}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  )
}
