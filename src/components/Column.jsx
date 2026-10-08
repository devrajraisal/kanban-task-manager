import { useState } from 'react'
import TaskCard from './TaskCard'

export default function Column({ column, tasks, today, onAdd, onEdit, onDelete, onMove, onShift }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (event) => {
    event.preventDefault()
    setDragOver(false)
    const id = Number(event.dataTransfer.getData('text/plain'))
    if (Number.isInteger(id)) onMove(id, column.id)
  }

  return (
    <section className="column" aria-label={`${column.label} column`}>
      <div className="col-header">
        <h2 className="col-title">
          <span className="dot" style={{ background: column.color }} aria-hidden="true" />
          {column.label}
          <span className="count" aria-label={`${tasks.length} tasks`}>{tasks.length}</span>
        </h2>
        <button type="button" className="icon-btn" aria-label={`Add task to ${column.label}`} onClick={onAdd}>+</button>
      </div>
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        data-testid={`zone-${column.id}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {tasks.length === 0 && <p className="empty">Drop tasks here</p>}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} today={today} onEdit={onEdit} onDelete={onDelete} onShift={onShift} />
        ))}
      </div>
    </section>
  )
}
