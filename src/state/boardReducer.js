import { STATUS_IDS } from '../constants'
import { normalizeTask } from './task'

export const nextId = (tasks) => tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1

// A task can only be added or edited when it has a title. Invalid actions return the same state.
export function boardReducer(tasks, action) {
  switch (action.type) {
    case 'add': {
      const task = normalizeTask(action.values)
      return task.title ? [...tasks, { ...task, id: nextId(tasks) }] : tasks
    }
    case 'update': {
      const task = normalizeTask(action.values)
      if (!task.title) return tasks
      return tasks.map((t) => (t.id === action.id ? { ...task, id: t.id } : t))
    }
    case 'delete':
      return tasks.filter((t) => t.id !== action.id)
    case 'move':
      if (!STATUS_IDS.includes(action.status)) return tasks
      return tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t))
    case 'shift': {
      const task = tasks.find((t) => t.id === action.id)
      if (!task) return tasks
      const target = STATUS_IDS[STATUS_IDS.indexOf(task.status) + action.direction]
      return target ? tasks.map((t) => (t.id === task.id ? { ...t, status: target } : t)) : tasks
    }
    default:
      return tasks
  }
}
