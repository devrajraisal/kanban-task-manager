import { describe, expect, it } from 'vitest'
import { filterTasks, getStats, isOverdue, normalizeTask, sanitizeTasks } from './task'

const task = (over = {}) => ({
  id: 1, title: 'Write docs', description: 'Explain setup', status: 'todo', priority: 'medium',
  deadline: '2026-10-10', label: 'Docs', progress: 0, ...over,
})

describe('normalizeTask', () => {
  it('trims text and applies safe defaults', () => {
    expect(normalizeTask({ title: '  Hello  ', status: 'nope', priority: 'urgent', deadline: 'tomorrow', progress: 'abc' }))
      .toMatchObject({ title: 'Hello', status: 'todo', priority: 'medium', deadline: '', progress: 0 })
  })
  it('keeps progress between 0 and 100', () => {
    expect(normalizeTask({ title: 'a', progress: 250 }).progress).toBe(100)
    expect(normalizeTask({ title: 'a', progress: -5 }).progress).toBe(0)
  })
})

describe('sanitizeTasks', () => {
  it('rejects data that is not a list', () => {
    expect(sanitizeTasks(null)).toBeNull()
    expect(sanitizeTasks({})).toBeNull()
  })
  it('drops items without a title or with a bad or duplicate id', () => {
    const result = sanitizeTasks([task(), task({ id: 1 }), task({ id: 2, title: '  ' }), task({ id: 'x' }), null])
    expect(result.map((t) => t.id)).toEqual([1])
  })
  it('keeps an empty list as empty', () => {
    expect(sanitizeTasks([])).toEqual([])
  })
})

describe('isOverdue', () => {
  it('flags past deadlines only for unfinished tasks', () => {
    expect(isOverdue(task({ deadline: '2026-10-01' }), '2026-10-08')).toBe(true)
    expect(isOverdue(task({ deadline: '2026-10-01', status: 'done' }), '2026-10-08')).toBe(false)
    expect(isOverdue(task({ deadline: '2026-10-08' }), '2026-10-08')).toBe(false)
    expect(isOverdue(task({ deadline: '' }), '2026-10-08')).toBe(false)
  })
})

describe('filterTasks and getStats', () => {
  const tasks = [
    task({ id: 1, title: 'Fix login bug', priority: 'high' }),
    task({ id: 2, title: 'Update README', description: 'Mention the login flow', priority: 'low' }),
    task({ id: 3, title: 'Design logo', status: 'done', priority: 'high' }),
  ]
  it('searches title and description and filters by priority', () => {
    expect(filterTasks(tasks, { search: 'LOGIN' }).map((t) => t.id)).toEqual([1, 2])
    expect(filterTasks(tasks, { priority: 'high' }).map((t) => t.id)).toEqual([1, 3])
    expect(filterTasks(tasks, { search: 'login', priority: 'low' }).map((t) => t.id)).toEqual([2])
  })
  it('counts totals, done, blocked and overdue tasks', () => {
    const stats = getStats([...tasks, task({ id: 4, status: 'blocked', deadline: '2026-01-01' })], '2026-10-08')
    // Only the blocked task has a past deadline. The others are due on 2026-10-10 or are done.
    expect(stats).toEqual({ total: 4, done: 1, blocked: 1, overdue: 1 })
  })
})
