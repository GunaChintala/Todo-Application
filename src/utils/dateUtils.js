/** Local YYYY-MM-DD key so streak logic follows the calendar, not UTC. */
export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function todayKey() {
  return toDateKey(new Date())
}

export function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + amount)
  return toDateKey(date)
}

export function compareDateKeys(a, b) {
  if (a === b) return 0
  return a < b ? -1 : 1
}

export function isFutureDate(dateKey, today = todayKey()) {
  return compareDateKeys(dateKey, today) > 0
}

export function isBefore(dateKey, otherKey) {
  return compareDateKeys(dateKey, otherKey) < 0
}

export function formatLongDate(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatMonthYear(year, monthIndex) {
  return new Date(year, monthIndex, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

export function weekdayShort(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, { weekday: 'short' })
}

export function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

/** Monday-first week that contains the given date. */
export function getWeekDateKeys(dateKey = todayKey()) {
  const date = parseDateKey(dateKey)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(monday)
    next.setDate(monday.getDate() + index)
    return toDateKey(next)
  })
}

/**
 * Calendar cells for a month. Empty slots are null so the grid
 * can keep Monday as the first column across month/year changes.
 */
export function getMonthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const mondayBasedIndex = (first.getDay() + 6) % 7
  const cells = Array(mondayBasedIndex).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toDateKey(new Date(year, monthIndex, day)))
  }

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return cells
}

export function eachDateKey(fromKey, toKey) {
  const keys = []
  let cursor = fromKey
  while (compareDateKeys(cursor, toKey) <= 0) {
    keys.push(cursor)
    cursor = addDays(cursor, 1)
  }
  return keys
}

export function minDateKey(keys) {
  return keys.reduce((lowest, key) => (key < lowest ? key : lowest))
}
