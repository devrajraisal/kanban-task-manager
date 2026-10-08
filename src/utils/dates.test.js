import { describe, expect, it } from 'vitest'
import { addDays, formatDeadline, toDateString } from './dates'

describe('date helpers', () => {
  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
  it('formats a local date string without shifting the day', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(formatDeadline('2026-10-15')).toBe('Oct 15')
  })
})
