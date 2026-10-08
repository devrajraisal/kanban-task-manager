import { PRIORITIES } from '../constants'

export default function Controls({ filters, onChange }) {
  return (
    <div className="controls">
      <input
        type="search"
        className="input"
        placeholder="Search tasks..."
        aria-label="Search tasks"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <select
        className="input"
        aria-label="Filter by priority"
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
      >
        <option value="all">All priorities</option>
        {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
      </select>
    </div>
  )
}
