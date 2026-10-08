// Deadlines are stored as plain "YYYY-MM-DD" strings. Comparing strings avoids time zone surprises.
const pad = (n) => String(n).padStart(2, '0')

export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const todayString = () => toDateString(new Date())

export function addDays(dateString, days) {
  const [y, m, d] = dateString.split('-').map(Number)
  return toDateString(new Date(y, m - 1, d + days))
}

export function formatDeadline(dateString) {
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
