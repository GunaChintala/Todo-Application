import { isFutureDate } from '../utils/dateUtils'
import { isTaskActiveOn } from '../utils/streakUtils'

export default function TaskCard({
  task,
  dateKey,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
}) {
  const done = task.completions?.[dateKey] === true
  const disabled = !isTaskActiveOn(task, dateKey) || isFutureDate(dateKey)

  return (
    <article className={`task-card ${done ? 'done' : ''}`}>
      <button
        className={`check ${done ? 'checked' : ''}`}
        disabled={disabled}
        onClick={() => onToggle(task.id, dateKey)}
        aria-label={done ? `Uncomplete ${task.title}` : `Complete ${task.title}`}
      >
        {done ? '✓' : ''}
      </button>
      <button className="task-main" onClick={() => onOpen(task)}>
        <span className="task-icon" style={{ background: `${task.color}22`, color: task.color }}>
          {task.icon}
        </span>
        <span>
          <strong>{task.title}</strong>
          <small>
            {task.category} · 🔥 {task.currentStreak} day streak
          </small>
        </span>
      </button>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">
          ✎
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(task)} aria-label="Delete task">
          ⌫
        </button>
      </div>
    </article>
  )
}
