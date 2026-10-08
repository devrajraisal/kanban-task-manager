import { useState } from 'react'
import Column from './components/Column'
import Controls from './components/Controls'
import Header from './components/Header'
import TaskModal from './components/TaskModal'
import { COLUMNS } from './constants'
import { useBoard } from './state/boardContext'
import { filterTasks, getStats } from './state/task'
import { todayString } from './utils/dates'

export default function App() {
  const { tasks, dispatch } = useBoard()
  const [filters, setFilters] = useState({ search: '', priority: 'all' })
  const [modal, setModal] = useState(null) // null, { task }, or { status } for a new task
  const today = todayString()

  const visible = filterTasks(tasks, filters)
  const stats = getStats(tasks, today)

  const handleSave = (values) => {
    if (modal.task) dispatch({ type: 'update', id: modal.task.id, values })
    else dispatch({ type: 'add', values })
    setModal(null)
  }

  const handleDelete = (task) => {
    if (window.confirm(`Delete "${task.title}"?`)) dispatch({ type: 'delete', id: task.id })
  }

  return (
    <>
      <Header stats={stats} onAdd={() => setModal({ status: 'todo' })} />
      <Controls filters={filters} onChange={setFilters} />
      <main className="board">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={visible.filter((t) => t.status === column.id)}
            today={today}
            onAdd={() => setModal({ status: column.id })}
            onEdit={(task) => setModal({ task })}
            onDelete={handleDelete}
            onMove={(id, status) => dispatch({ type: 'move', id, status })}
            onShift={(id, direction) => dispatch({ type: 'shift', id, direction })}
          />
        ))}
      </main>
      {modal && (
        <TaskModal
          task={modal.task}
          defaultStatus={modal.status}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
