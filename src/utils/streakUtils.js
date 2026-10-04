import {
  addDays,
  compareDateKeys,
  eachDateKey,
  minDateKey,
  todayKey,
} from './dateUtils'

export function isTaskCompletedOn(task, dateKey) {
  return task.completions?.[dateKey] === true
}

export function isTaskActiveOn(task, dateKey) {
  return compareDateKeys(task.createdAt, dateKey) <= 0
}

export function tasksRequiredOn(tasks, dateKey) {
  return tasks.filter((task) => isTaskActiveOn(task, dateKey))
}

/**
 * Current streak = consecutive completed days ending today, or yesterday
 * if today is still unchecked (end-of-day grace).
 *
 * Uses addDays() so month boundaries, year changes, and leap days (e.g.
 * 2024-02-29 → 2024-03-01) are real calendar steps, not array indexes.
 * Days before createdAt are ignored so a new task starts at 0/1.
 */
export function calculateCurrentStreak(task, asOfDate = todayKey()) {
  if (!isTaskActiveOn(task, asOfDate)) return 0

  let cursor = isTaskCompletedOn(task, asOfDate) ? asOfDate : addDays(asOfDate, -1)

  if (compareDateKeys(cursor, task.createdAt) < 0) {
    return isTaskCompletedOn(task, asOfDate) ? 1 : 0
  }

  let streak = 0
  while (compareDateKeys(cursor, task.createdAt) >= 0) {
    if (!isTaskCompletedOn(task, cursor)) break
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}

/**
 * Longest streak scans every calendar day from createdAt through asOfDate.
 * A missing or false completion breaks the run (a miss resets current,
 * but longest keeps the best run seen so far).
 */
export function calculateLongestStreak(task, asOfDate = todayKey()) {
  if (!isTaskActiveOn(task, asOfDate)) return 0

  let longest = 0
  let run = 0

  for (const dateKey of eachDateKey(task.createdAt, asOfDate)) {
    if (isTaskCompletedOn(task, dateKey)) {
      run += 1
      if (run > longest) longest = run
    } else {
      run = 0
    }
  }

  return longest
}

export function calculateTaskStats(task, asOfDate = todayKey()) {
  if (!isTaskActiveOn(task, asOfDate)) {
    return { completedDays: 0, missedDays: 0, trackedDays: 0, completionRate: 0 }
  }

  const dates = eachDateKey(task.createdAt, asOfDate)
  let completedDays = 0

  dates.forEach((dateKey) => {
    if (isTaskCompletedOn(task, dateKey)) completedDays += 1
  })

  const trackedDays = dates.length
  const missedDays = trackedDays - completedDays
  const completionRate = trackedDays === 0 ? 0 : Math.round((completedDays / trackedDays) * 100)

  return { completedDays, missedDays, trackedDays, completionRate }
}

export function calculateCompletionRate(task, asOfDate = todayKey()) {
  return calculateTaskStats(task, asOfDate).completionRate
}

export function calculateDailyProgress(tasks, dateKey = todayKey()) {
  const required = tasksRequiredOn(tasks, dateKey)
  const completed = required.filter((task) => isTaskCompletedOn(task, dateKey)).length
  const total = required.length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { completed, total, percent }
}

export function isDayFullyComplete(tasks, dateKey) {
  const required = tasksRequiredOn(tasks, dateKey)
  if (required.length === 0) return false
  return required.every((task) => isTaskCompletedOn(task, dateKey))
}

export function getDayStatus(tasks, dateKey) {
  const { completed, total } = calculateDailyProgress(tasks, dateKey)
  if (total === 0 || completed === 0) return 'none'
  if (completed === total) return 'full'
  return 'partial'
}

export function calculateOverallStreak(tasks, asOfDate = todayKey()) {
  if (tasks.length === 0) return { current: 0, longest: 0 }

  const start = minDateKey(tasks.map((task) => task.createdAt))
  let longest = 0
  let run = 0

  for (const dateKey of eachDateKey(start, asOfDate)) {
    if (tasksRequiredOn(tasks, dateKey).length === 0) {
      run = 0
      continue
    }

    if (isDayFullyComplete(tasks, dateKey)) {
      run += 1
      if (run > longest) longest = run
    } else if (dateKey === asOfDate) {
      // Grace: an unfinished today does not reset the chain yet.
      continue
    } else {
      run = 0
    }
  }

  let current = 0
  let cursor = isDayFullyComplete(tasks, asOfDate) ? asOfDate : addDays(asOfDate, -1)

  while (compareDateKeys(cursor, start) >= 0) {
    if (tasksRequiredOn(tasks, cursor).length === 0) break
    if (!isDayFullyComplete(tasks, cursor)) break
    current += 1
    cursor = addDays(cursor, -1)
  }

  return { current, longest }
}

export function calculateWeeklyProgress(tasks, weekKeys) {
  return weekKeys.map((dateKey) => ({
    dateKey,
    ...calculateDailyProgress(tasks, dateKey),
  }))
}

export function totalCompletedCheckmarks(tasks) {
  return tasks.reduce((sum, task) => {
    return (
      sum +
      Object.values(task.completions || {}).filter(Boolean).length
    )
  }, 0)
}
