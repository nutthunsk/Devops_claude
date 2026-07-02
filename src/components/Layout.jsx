import { useState } from 'react'
import { useApp } from '../store'

export const PAGES = [
  { id: 'dashboard', label: 'Dashboard', short: 'Home' },
  { id: 'accounts', label: 'Accounts', short: 'Accounts' },
  { id: 'income', label: 'Income', short: 'Income' },
  { id: 'expense', label: 'Expenses', short: 'Expenses' },
  { id: 'savings', label: 'Savings & Invest', short: 'Savings' },
  { id: 'community', label: 'Community', short: 'Social' },
  { id: 'settings', label: 'Settings', short: 'Settings' },
]

const ICONS = {
  dashboard: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />,
  accounts: <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zm0 3h18M7 15h4" />,
  income: <path d="M12 19V5m0 0-6 6m6-6 6 6" />,
  expense: <path d="M12 5v14m0 0 6-6m-6 6-6-6" />,
  savings: <path d="M12 3v18M5.5 8.5 12 3l6.5 5.5M7 21h10a2 2 0 0 0 2-2v-5H5v5a2 2 0 0 0 2 2z" />,
  community: <path d="M17 8a5 5 0 1 0-9.6 2H4v10h16V10h-3.4A5 5 0 0 0 17 8zM9 21v-4h6v4" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
}

function NavIcon({ id }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[id]}
    </svg>
  )
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="17" height="17" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 11l3.2 10L16 13.5 20.8 21 24 11" />
      </svg>
    </span>
  )
}

export default function Layout({ page, onNav, children }) {
  const { user, logout } = useApp()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('ws-sidebar') === '1')

  const toggleSidebar = () => {
    setCollapsed((c) => {
      localStorage.setItem('ws-sidebar', c ? '0' : '1')
      return !c
    })
  }

  return (
    <div className={`shell${collapsed ? ' sb-collapsed' : ''}`}>
      <aside className="sidebar">
        <button
          className="collapse-btn"
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="brand"><BrandMark /> <span className="label">WealthShare</span></div>
        <nav className="nav-list" aria-label="Main">
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={`nav-item${page === p.id ? ' active' : ''}`}
              onClick={() => onNav(p.id)}
              aria-current={page === p.id ? 'page' : undefined}
              title={collapsed ? p.label : undefined}
            >
              <NavIcon id={p.id} /> <span className="label">{p.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="user-chip" title={collapsed ? user.name : undefined}>
            <img src={user.avatar} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
            <div className="u-info">
              <div className="u-name">{user.name}</div>
              <div className="u-mail">{user.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title={collapsed ? 'Sign out' : undefined}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="label">Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>

      <nav className="bottomnav" aria-label="Main">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`nav-item${page === p.id ? ' active' : ''}`}
            onClick={() => onNav(p.id)}
            aria-current={page === p.id ? 'page' : undefined}
          >
            <NavIcon id={p.id} /> {p.short}
          </button>
        ))}
      </nav>
    </div>
  )
}
