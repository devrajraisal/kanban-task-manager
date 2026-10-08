import { PRIORITY_IDS, STATUS_IDS } from '../constants'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// Turns form values or saved data into a clean task, without the id.
export function normalizeTask(values = {}) {
  const progress = Math.round(Number(values.progress))
  return {
    title: String(values.title ?? '').trim(),
    description: String(values.description ?? '').trim(),
    status: STATUS_IDS.includes(values.status) ? values.status : 'todo',
    priority: PRIORITY_IDS.includes(values.priority) ? values.priority : 'medium',
    deadline: DATE_PATTERN.test(values.deadline ?? '') ? values.deadline : '',
    label: String(values.label ?? '').trim(),
    progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : 0,
  }
}

// Saved data comes from the browser, so it is checked before it is used.
export function sanitizeTasks(raw) {
  if (!Array.isArray(raw)) return null
  const seen = new Set()
  const tasks = []
  for (const item of raw) {
    if (!item || !Number.isInteger(item.id) || seen.has(item.id)) continue
    const task = normalizeTask(item)
    if (!task.title) continue
    seen.add(item.id)
    tasks.push({ ...task, id: item.id })
  }
  return tasks
}

export function isOverdue(task, today) {
  return Boolean(task.deadline) && task.deadline < today && task.status !== 'done'
}

export function filterTasks(tasks, { search = '', priority = 'all' } = {}) {
  const q = search.trim().toLowerCase()
  return tasks.filter((t) => {
    const matchesText = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    return matchesText && (priority === 'all' || t.priority === priority)
  })
}

export function getStats(tasks, today) {
  return {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    blocked: tasks.filter((t) => t.status === 'blocked').length,
    overdue: tasks.filter((t) => isOverdue(t, today)).length,
  }
}
