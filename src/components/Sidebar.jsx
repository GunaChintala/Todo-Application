const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ currentPage, onNavigate, open, onClose }) {
  return (
    <>
      {open ? <button className="sidebar-backdrop" onClick={onClose} aria-label="Close menu" /> : null}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">🔥</span>
          <div>
            <strong>StreakTodo</strong>
            <p>Daily habits & tasks</p>
          </div>
        </div>
        <nav className="side-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={currentPage === item.id ? 'nav-link active' : 'nav-link'}
              onClick={() => {
                onNavigate(item.id)
                onClose()
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export function MobileNav({ currentPage, onNavigate }) {
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={currentPage === item.id ? 'mobile-link active' : 'mobile-link'}
          onClick={() => onNavigate(item.id)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
