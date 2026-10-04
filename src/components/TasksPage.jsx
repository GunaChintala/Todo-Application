import { useMemo, useState } from 'react'
import { getWeekDateKeys, isFutureDate, weekdayShort } from '../utils/dateUtils'
import { isTaskActiveOn, isTaskCompletedOn } from '../utils/streakUtils'
import { filterAndSortTasks } from '../hooks/useTasks'
import TaskList from './TaskList'

export default function TasksPage({
  tasks,
  categories,
  today,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
  onCreate,
}) {
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('recent')
  const weekKeys = getWeekDateKeys(today)

  const visible = useMemo(
    () => filterAndSortTasks(tasks, { status, category, sort }),
    [tasks, status, category, sort],
  )

  return (
    <section className="page">
      <div className="section-head">
        <div>
          <p className="muted">Filter, sort, and check off this week.</p>
        </div>
        <button className="btn primary" onClick={onCreate}>
          + New task
        </button>
      </div>

      <div className="filters">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed today</option>
          <option value="pending">Pending today</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="recent">Recently created</option>
          <option value="completed">Most completed</option>
          <option value="streak">Highest streak</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      <div className="week-table-wrap">
        <table className="week-table">
          <thead>
            <tr>
              <th>Task</th>
              {weekKeys.map((dateKey) => (
                <th key={dateKey}>
                  {weekdayShort(dateKey)}
                  <small>{dateKey.slice(8)}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((task) => (
              <tr key={task.id}>
                <td>
                  <button className="linkish" onClick={() => onOpen(task)}>
                    {task.icon} {task.title}
                  </button>
                </td>
                {weekKeys.map((dateKey) => {
                  const disabled = !isTaskActiveOn(task, dateKey) || isFutureDate(dateKey)
                  const done = isTaskCompletedOn(task, dateKey)
                  return (
                    <td key={dateKey}>
                      <button
                        className={`mini-check ${done ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
                        disabled={disabled}
                        onClick={() => onToggle(task.id, dateKey)}
                      >
                        {done ? '✓' : disabled ? '·' : ''}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskList
        tasks={visible}
        dateKey={today}
        emptyMessage="No tasks match these filters."
        onToggle={onToggle}
        onOpen={onOpen}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  )
}
