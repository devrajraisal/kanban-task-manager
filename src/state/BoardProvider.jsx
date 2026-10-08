import { useEffect, useReducer } from 'react'
import { createSeedTasks } from '../data/seedTasks'
import { todayString } from '../utils/dates'
import { boardReducer } from './boardReducer'
import { BoardContext } from './boardContext'
import { sanitizeTasks } from './task'

const STORAGE_KEY = 'taskflow:v1'

function loadInitialTasks() {
  try {
    const saved = sanitizeTasks(JSON.parse(window.localStorage.getItem(STORAGE_KEY)))
    if (saved) return saved
  } catch {
    // Missing, blocked, or corrupt storage: fall back to the sample tasks.
  }
  return createSeedTasks(todayString())
}

export function BoardProvider({ children }) {
  const [tasks, dispatch] = useReducer(boardReducer, undefined, loadInitialTasks)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The board still works in memory if storage is unavailable.
    }
  }, [tasks])

  return <BoardContext.Provider value={{ tasks, dispatch }}>{children}</BoardContext.Provider>
}
