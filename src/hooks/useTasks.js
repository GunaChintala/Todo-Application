import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  addTask as persistAdd,
  deleteTask as persistDelete,
  loadSettings,
  loadTasks,
  resetAllData,
  saveSettings,
  saveTasks,
  toggleTaskCompletion as persistToggle,
  updateTask as persistUpdate,
} from '../utils/storageUtils'
import { todayKey } from '../utils/dateUtils'
import {
  calculateCompletionRate,
  calculateCurrentStreak,
  calculateDailyProgress,
  calculateLongestStreak,
  calculateOverallStreak,
  calculateWeeklyProgress,
  isTaskCompletedOn,
  totalCompletedCheckmarks,
} from '../utils/streakUtils'
import { getWeekDateKeys } from '../utils/dateUtils'

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [settings, setSettings] = useState(() => loadSettings())
  const today = todayKey()

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    saveSettings(settings)
    document.documentElement.dataset.theme = settings.theme
  }, [settings])

  const addTask = useCallback((payload) => {
    setTasks((current) => persistAdd(current, payload))
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks((current) => persistUpdate(current, id, updates))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((current) => persistDelete(current, id))
  }, [])

  const toggleCompletion = useCallback((id, dateKey) => {
    setTasks((current) => persistToggle(current, id, dateKey))
  }, [])

  const resetData = useCallback(() => {
    const sample = resetAllData()
    saveTasks(sample)
    setTasks(sample)
  }, [])

  const stats = useMemo(() => {
    const daily = calculateDailyProgress(tasks, today)
    const overall = calculateOverallStreak(tasks, today)
    const weekKeys = getWeekDateKeys(today)
    return {
      today,
      daily,
      overall,
      week: calculateWeeklyProgress(tasks, weekKeys),
      totalCompleted: totalCompletedCheckmarks(tasks),
      categories: [...new Set(tasks.map((task) => task.category))].sort(),
    }
  }, [tasks, today])

  const decorateTask = useCallback(
    (task) => ({
      ...task,
      currentStreak: calculateCurrentStreak(task, today),
      longestStreak: calculateLongestStreak(task, today),
      completionRate: calculateCompletionRate(task, today),
      completedToday: isTaskCompletedOn(task, today),
    }),
    [today],
  )

  const decoratedTasks = useMemo(() => tasks.map(decorateTask), [tasks, decorateTask])

  return {
    tasks: decoratedTasks,
    rawTasks: tasks,
    settings,
    setSettings,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    resetData,
  }
}

export function filterAndSortTasks(tasks, { status, category, sort }) {
  let next = [...tasks]

  if (status === 'completed') {
    next = next.filter((task) => task.completedToday)
  } else if (status === 'pending') {
    next = next.filter((task) => !task.completedToday)
  }

  if (category && category !== 'all') {
    next = next.filter((task) => task.category === category)
  }

  next.sort((a, b) => {
    if (sort === 'completed') return b.completionRate - a.completionRate
    if (sort === 'streak') return b.currentStreak - a.currentStreak
    if (sort === 'alpha') return a.title.localeCompare(b.title)
    return b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)
  })

  return next
}
