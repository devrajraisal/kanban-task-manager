export const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6366f1' },
  { id: 'progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#10b981' },
  { id: 'blocked', label: 'Blocked', color: '#ef4444' },
]

export const PRIORITIES = [
  { id: 'high', label: 'High', icon: '🔴' },
  { id: 'medium', label: 'Medium', icon: '🟡' },
  { id: 'low', label: 'Low', icon: '🟢' },
]

export const STATUS_IDS = COLUMNS.map((c) => c.id)
export const PRIORITY_IDS = PRIORITIES.map((p) => p.id)
