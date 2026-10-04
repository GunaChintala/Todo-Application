import { useEffect, useState } from 'react'
import { CATEGORIES, TASK_COLORS, TASK_ICONS } from '../data/sampleTasks'

const emptyForm = {
  title: '',
  description: '',
  category: 'Personal',
  color: TASK_COLORS[0],
  icon: TASK_ICONS[0],
}

export default function TaskForm({ open, initialTask, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description || '',
        category: initialTask.category,
        color: initialTask.color,
        icon: initialTask.icon,
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, initialTask])

  if (!open) return null

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="modal form-modal" onSubmit={handleSubmit}>
        <h3>{initialTask ? 'Edit Task' : 'Create Todo'}</h3>
        <label>
          Task name
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Study Java"
            required
          />
        </label>
        <label>
          Description (optional)
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Practice Spring Boot for 1 hour"
            rows={3}
          />
        </label>
        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Color</legend>
          <div className="chip-row">
            {TASK_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={form.color === color ? 'swatch active' : 'swatch'}
                style={{ background: color }}
                onClick={() => setForm({ ...form, color })}
                aria-label={color}
              />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Icon</legend>
          <div className="chip-row">
            {TASK_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={form.icon === icon ? 'icon-pick active' : 'icon-pick'}
                onClick={() => setForm({ ...form, icon })}
              >
                {icon}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn primary">
            {initialTask ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  )
}
