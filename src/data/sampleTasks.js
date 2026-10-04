import { addDays, todayKey } from '../utils/dateUtils'

function fillRange(startKey, endKey, predicate) {
  const completions = {}
  let cursor = startKey
  while (cursor <= endKey) {
    completions[cursor] = predicate(cursor)
    cursor = addDays(cursor, 1)
  }
  return completions
}

/** Sample habits relative to today so the dashboard always has realistic streaks. */
export function createSampleTasks() {
  const today = todayKey()
  const createdAt = addDays(today, -20)

  return [
    {
      id: 'sample-water',
      title: 'Drink Water',
      description: 'Finish at least 8 glasses of water',
      category: 'Health',
      color: '#0ea5e9',
      icon: '💧',
      createdAt,
      completions: fillRange(createdAt, today, () => true),
    },
    {
      id: 'sample-exercise',
      title: 'Exercise',
      description: 'Move for 30 minutes',
      category: 'Fitness',
      color: '#22c55e',
      icon: '💪',
      createdAt,
      completions: fillRange(createdAt, today, (dateKey) => dateKey !== addDays(today, -10)),
    },
    {
      id: 'sample-read',
      title: 'Read 30 Minutes',
      description: 'Read a book or technical article',
      category: 'Learning',
      color: '#f59e0b',
      icon: '📚',
      createdAt,
      completions: fillRange(createdAt, today, (dateKey) => dateKey !== today && dateKey !== addDays(today, -6)),
    },
    {
      id: 'sample-java',
      title: 'Study Java',
      description: 'Practice Spring Boot for 1 hour',
      category: 'Learning',
      color: '#6366f1',
      icon: '☕',
      createdAt,
      completions: fillRange(createdAt, today, (dateKey) => dateKey !== addDays(today, -8)),
    },
  ]
}

export const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Work', 'Personal']

export const TASK_COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']

export const TASK_ICONS = ['✨', '💧', '💪', '📚', '☕', '🧘', '📝', '🎯', '🌱', '🔥']
