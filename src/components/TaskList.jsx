import TaskCard from './TaskCard'

export default function TaskList({
  tasks,
  dateKey,
  emptyMessage,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>🌱</p>
        <h3>No tasks yet</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          dateKey={dateKey}
          onToggle={onToggle}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
