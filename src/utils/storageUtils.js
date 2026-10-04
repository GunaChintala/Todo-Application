import { isFutureDate, todayKey } from './dateUtils'
import { isTaskActiveOn } from './streakUtils'
import { createSampleTasks } from '../data/sampleTasks'

export const STORAGE_KEY = 'todo-streak-tracker:v1'
export const SETTINGS_KEY = 'todo-streak-tracker:settings'

const defaultSettings = {
  theme: 'light',
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadSettings() {
  return { ...defaultSettings, ...readJson(SETTINGS_KEY, {}) }
}

export function saveSettings(settings) {
  writeJson(SETTINGS_KEY, settings)
}

export function saveTasks(tasks) {
  writeJson(STORAGE_KEY, tasks)
}

export function loadTasks() {
  const stored = readJson(STORAGE_KEY, null)
  if (!Array.isArray(stored) || stored.length === 0) {
    const sample = createSampleTasks()
    saveTasks(sample)
    return sample
  }
  return stored
}

export function addTask(tasks, payload) {
  const next = [
    ...tasks,
    {
      id: crypto.randomUUID(),
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      category: payload.category || 'Personal',
      color: payload.color || '#6366f1',
      icon: payload.icon || '✨',
      createdAt: todayKey(),
      completions: {},
    },
  ]
  saveTasks(next)
  return next
}

export function updateTask(tasks, id, updates) {
  const next = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
  saveTasks(next)
  return next
}

export function deleteTask(tasks, id) {
  const next = tasks.filter((task) => task.id !== id)
  saveTasks(next)
  return next
}

export function toggleTaskCompletion(tasks, id, dateKey) {
  const task = tasks.find((item) => item.id === id)
  if (!task || isFutureDate(dateKey) || !isTaskActiveOn(task, dateKey)) return tasks

  const next = tasks.map((task) => {
    if (task.id !== id) return task
    const completions = { ...task.completions }
    completions[dateKey] = !completions[dateKey]
    return { ...task, completions }
  })

  saveTasks(next)
  return next
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEY)
  return createSampleTasks()
}
