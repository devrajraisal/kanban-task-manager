import { describe, expect, it } from 'vitest'
import { boardReducer, nextId } from './boardReducer'
import { createSeedTasks } from '../data/seedTasks'
import { getStats } from './task'

const base = [
  { id: 1, title: 'A', description: '', status: 'todo', priority: 'low', deadline: '', label: '', progress: 0 },
  { id: 5, title: 'B', description: '', status: 'blocked', priority: 'high', deadline: '', label: '', progress: 0 },
]

describe('boardReducer', () => {
  it('adds a task with the next free id', () => {
    expect(nextId(base)).toBe(6)
    const next = boardReducer(base, { type: 'add', values: { title: '  New one ', status: 'done' } })
    expect(next).toHaveLength(3)
    expect(next[2]).toMatchObject({ id: 6, title: 'New one', status: 'done' })
  })

  it('ignores a task without a title', () => {
    expect(boardReducer(base, { type: 'add', values: { title: '   ' } })).toBe(base)
    expect(boardReducer(base, { type: 'update', id: 1, values: { title: '' } })).toBe(base)
  })

  it('updates only the matching task and keeps its id', () => {
    const next = boardReducer(base, { type: 'update', id: 1, values: { title: 'A2', priority: 'high' } })
    expect(next[0]).toMatchObject({ id: 1, title: 'A2', priority: 'high' })
    expect(next[1]).toBe(base[1])
  })

  it('deletes a task', () => {
    expect(boardReducer(base, { type: 'delete', id: 1 }).map((t) => t.id)).toEqual([5])
  })

  it('moves a task to a valid column only', () => {
    expect(boardReducer(base, { type: 'move', id: 1, status: 'done' })[0].status).toBe('done')
    expect(boardReducer(base, { type: 'move', id: 1, status: 'archive' })).toBe(base)
  })

  it('shifts a task one column and stops at the edges', () => {
    expect(boardReducer(base, { type: 'shift', id: 1, direction: 1 })[0].status).toBe('progress')
    expect(boardReducer(base, { type: 'shift', id: 1, direction: -1 })).toBe(base)
    expect(boardReducer(base, { type: 'shift', id: 5, direction: 1 })).toBe(base)
    expect(boardReducer(base, { type: 'shift', id: 99, direction: 1 })).toBe(base)
  })

  it('returns the same state for unknown actions', () => {
    expect(boardReducer(base, { type: 'nope' })).toBe(base)
  })
})

describe('seed tasks', () => {
  it('creates sample tasks with exactly one overdue task', () => {
    const today = '2026-10-08'
    const tasks = createSeedTasks(today)
    expect(tasks).toHaveLength(7)
    expect(getStats(tasks, today).overdue).toBe(1)
  })
})
