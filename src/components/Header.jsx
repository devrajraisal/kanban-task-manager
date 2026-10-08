export default function Header({ stats, onAdd }) {
  return (
    <header className="header">
      <div className="logo"><span className="logo-icon" aria-hidden="true">✦</span> TaskFlow</div>
      <dl className="stats" aria-label="Board summary">
        <div><dt>Total</dt><dd>{stats.total}</dd></div>
        <div><dt>Done</dt><dd className="ok">{stats.done}</dd></div>
        <div><dt>Blocked</dt><dd className="bad">{stats.blocked}</dd></div>
        <div><dt>Overdue</dt><dd className="warn">{stats.overdue}</dd></div>
      </dl>
      <button type="button" className="btn" onClick={onAdd}>+ Add task</button>
    </header>
  )
}
