import { useState } from 'react'
import { useApp } from '../store'

// id maps to a nav key; `tkey` points at the i18n label group.
export const PAGES = [
  { id: 'dashboard', tkey: 'dashboard' },
  { id: 'accounts', tkey: 'accounts' },
  { id: 'income', tkey: 'income' },
  { id: 'expense', tkey: 'expense' },
  { id: 'savings', tkey: 'savings' },
  { id: 'community', tkey: 'community' },
  { id: 'settings', tkey: 'settings' },
]

const ICONS = {
  dashboard: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />,
  accounts: <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zm0 3h18M7 15h4" />,
  // Income → wallet (money coming in), tinted green
  income: <><path d="M17 9V6.5A1.5 1.5 0 0 0 15.5 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10.5a1.5 1.5 0 0 0 1.5-1.5V15" /><path d="M21 9.5a1 1 0 0 0-1-1h-4a3 3 0 0 0 0 6h4a1 1 0 0 0 1-1z" /><path d="M16.5 11.5v.01" /></>,
  // Expenses → credit card (money going out), tinted red
  expense: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></>,
  savings: <path d="M12 3v18M5.5 8.5 12 3l6.5 5.5M7 21h10a2 2 0 0 0 2-2v-5H5v5a2 2 0 0 0 2 2z" />,
  community: <path d="M17 8a5 5 0 1 0-9.6 2H4v10h16V10h-3.4A5 5 0 0 0 17 8zM9 21v-4h6v4" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V8a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
}

// Income/Expense carry a semantic tint so direction reads at a glance.
const TINT = { income: 'var(--positive)', expense: 'var(--negative)' }

function NavIcon({ id }) {
  return (
    <svg
      width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke={TINT[id] || 'currentColor'} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
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
  const { user, logout, t } = useApp()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('ws-sidebar') === '1')

  const toggleSidebar = () => {
    setCollapsed((c) => {
      localStorage.setItem('ws-sidebar', c ? '0' : '1')
      return !c
    })
  }

  const label = (p) => t(`nav.${p.tkey}`)
  const shortLabel = (p) => t(`nav.${p.tkey}Short`)

  return (
    <div className={`shell${collapsed ? ' sb-collapsed' : ''}`}>
      <aside className="sidebar">
        <button
          className="collapse-btn"
          onClick={toggleSidebar}
          title={collapsed ? t('common.expand') : t('common.collapse')}
          aria-label={collapsed ? t('common.expand') : t('common.collapse')}
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
              title={collapsed ? label(p) : undefined}
            >
              <NavIcon id={p.id} /> <span className="label">{label(p)}</span>
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
          <button className="logout-btn" onClick={logout} title={collapsed ? t('common.signOut') : undefined}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="label">{t('common.signOut')}</span>
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
            <NavIcon id={p.id} /> {shortLabel(p)}
          </button>
        ))}
      </nav>
    </div>
  )
}
