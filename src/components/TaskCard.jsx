import { PRIORITIES, STATUS_IDS } from '../constants'
import { isOverdue } from '../state/task'
import { formatDeadline } from '../utils/dates'

export default function TaskCard({ task, today, onEdit, onDelete, onShift }) {
  const overdue = isOverdue(task, today)
  const priority = PRIORITIES.find((p) => p.id === task.priority)
  const index = STATUS_IDS.indexOf(task.status)

  return (
    <article
      className="card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(task.id))
        e.dataTransfer.effectAllowed = 'move'
      }}
    >
      <div className="card-top">
        <h3 className="card-title">{task.title}</h3>
        <button type="button" className="icon-btn" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>✏️</button>
      </div>
      {task.description && <p className="card-desc">{task.description}</p>}
      <div className="tags">
        <span className={`tag priority-${task.priority}`}>{priority.label}</span>
        {task.label && <span className="tag label">{task.label}</span>}
      </div>
      {task.progress > 0 && (
        <div className="progress" role="progressbar" aria-label="Progress" aria-valuenow={task.progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${task.progress}%` }} />
        </div>
      )}
      <div className="card-footer">
        <span className={`deadline ${overdue ? 'overdue' : ''}`}>
          {task.deadline && <>📅 {formatDeadline(task.deadline)}</>}
          {overdue && <> <span role="img" aria-label="Overdue">⚠️</span></>}
        </span>
        <span className="actions">
          <button type="button" className="icon-btn" aria-label={`Move ${task.title} left`} disabled={index === 0} onClick={() => onShift(task.id, -1)}>←</button>
          <button type="button" className="icon-btn" aria-label={`Move ${task.title} right`} disabled={index === STATUS_IDS.length - 1} onClick={() => onShift(task.id, 1)}>→</button>
          <button type="button" className="icon-btn" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>🗑</button>
        </span>
      </div>
    </article>
  )
}
