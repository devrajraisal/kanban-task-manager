import { useState } from 'react'
import { COLUMNS, PRIORITIES } from '../constants'

const emptyForm = (status) => ({
  title: '', description: '', status, priority: 'medium', deadline: '', label: '', progress: 0,
})

export default function TaskModal({ task, defaultStatus = 'todo', onSave, onClose }) {
  const [form, setForm] = useState(task ? { ...emptyForm('todo'), ...task } : emptyForm(defaultStatus))
  const [error, setError] = useState('')

  const set = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    onSave(form)
  }

  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onSubmit={handleSubmit} noValidate>
        <h2 id="modal-title">{task ? 'Edit task' : 'Add new task'}</h2>

        <label className="field">Title *
          <input className="input" autoFocus value={form.title} onChange={set('title')} placeholder="What needs to be done?" aria-invalid={Boolean(error)} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}

        <label className="field">Description
          <textarea className="input" rows={3} value={form.description} onChange={set('description')} placeholder="Add some details..." />
        </label>

        <div className="row">
          <label className="field">Status
            <select className="input" value={form.status} onChange={set('status')}>
              {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="field">Priority
            <select className="input" value={form.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
        </div>

        <div className="row">
          <label className="field">Deadline
            <input className="input" type="date" value={form.deadline} onChange={set('deadline')} />
          </label>
          <label className="field">Label
            <input className="input" value={form.label} onChange={set('label')} placeholder="e.g. Frontend, API" />
          </label>
        </div>

        <label className="field">Progress: {form.progress}%
          <input type="range" min="0" max="100" step="5" value={form.progress} onChange={set('progress')} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">{task ? 'Save changes' : 'Add task'}</button>
        </div>
      </form>
    </div>
  )
}
