import { useState } from 'react'
import { useApp, CURRENCIES, fmtMoney } from '../store'

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', hint: 'Bright and clean' },
  { id: 'dark', label: 'Dark', hint: 'Easy on the eyes' },
  { id: 'system', label: 'System', hint: 'Match your device' },
]

export default function Settings() {
  const { user, updateProfile, theme, setTheme, currency, setCurrency, resetData } = useApp()

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Personalize WealthShare and manage your data.</div>
        </div>
      </div>

      <div className="settings-stack">
        {/* Appearance — the theme switcher */}
        <section className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Appearance</div>
              <div className="card-sub">Choose how WealthShare looks</div>
            </div>
          </div>
          <div className="theme-grid" role="radiogroup" aria-label="Theme">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                role="radio"
                aria-checked={theme === opt.id}
                className={`theme-card${theme === opt.id ? ' selected' : ''}`}
                onClick={() => setTheme(opt.id)}
              >
                <ThemeSwatch mode={opt.id} />
                <div className="theme-name">
                  {opt.label}
                  {theme === opt.id && <span className="theme-check" aria-hidden="true">✓</span>}
                </div>
                <div className="theme-hint">{opt.hint}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Profile */}
        <ProfileSection user={user} onSave={updateProfile} />

        {/* Preferences */}
        <section className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Preferences</div>
              <div className="card-sub">Regional and display options</div>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-label">Currency</div>
              <div className="setting-desc">Symbol used across the app · e.g. {fmtMoney(1250)}</div>
            </div>
            <select
              className="setting-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency"
            >
              {Object.entries(CURRENCIES).map(([code, c]) => (
                <option key={code} value={code}>{c.symbol} {code} — {c.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Data & privacy */}
        <DataSection onReset={resetData} />

        <div className="settings-about">WealthShare · v1.0.0 · Demo build</div>
      </div>
    </div>
  )
}

function ProfileSection({ user, onSave }) {
  const [name, setName] = useState(user.name)
  const [saved, setSaved] = useState(false)
  const dirty = name.trim() && name.trim() !== user.name

  const save = () => {
    if (!dirty) return
    onSave({ name: name.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Profile</div>
          <div className="card-sub">Your public display details</div>
        </div>
      </div>
      <div className="profile-row">
        <img className="profile-avatar" src={user.avatar} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="field" style={{ marginBottom: 10 }}>
            <label htmlFor="set-name">Display name</label>
            <input id="set-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="set-email">Email</label>
            <input id="set-email" value={user.email} disabled />
          </div>
        </div>
      </div>
      <div className="form-actions" style={{ marginTop: 16 }}>
        {saved && <span className="save-flash">✓ Saved</span>}
        <button className="btn btn-primary" onClick={save} disabled={!dirty}>Save changes</button>
      </div>
    </section>
  )
}

function DataSection({ onReset }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Data &amp; privacy</div>
          <div className="card-sub">This demo stores everything in your browser only</div>
        </div>
      </div>
      <div className="setting-row">
        <div>
          <div className="setting-label">Reset demo data</div>
          <div className="setting-desc">Restore accounts, transactions, goals and posts to their defaults.</div>
        </div>
        {confirming ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => { onReset(); setConfirming(false) }}>Confirm reset</button>
          </div>
        ) : (
          <button className="btn btn-ghost" onClick={() => setConfirming(true)}>Reset</button>
        )}
      </div>
    </section>
  )
}

// Miniature preview of each theme, rendered with fixed colors so it looks
// the same regardless of the currently-active theme.
function ThemeSwatch({ mode }) {
  const dark = mode === 'dark'
  const surface = dark ? '#1f2937' : '#ffffff'
  const bg = dark ? '#0b1220' : '#f3f4f6'
  const bar = dark ? '#374151' : '#e5e7eb'
  if (mode === 'system') {
    return (
      <div className="theme-swatch" aria-hidden="true">
        <div className="theme-swatch-half" style={{ background: '#f3f4f6' }}>
          <span style={{ background: '#0f766e' }} /><span style={{ background: '#e5e7eb' }} />
        </div>
        <div className="theme-swatch-half" style={{ background: '#0b1220' }}>
          <span style={{ background: '#10b981' }} /><span style={{ background: '#374151' }} />
        </div>
      </div>
    )
  }
  return (
    <div className="theme-swatch" style={{ background: bg }} aria-hidden="true">
      <div className="theme-swatch-card" style={{ background: surface }}>
        <span style={{ background: '#0f766e' }} />
        <span style={{ background: bar }} />
        <span style={{ background: bar, width: '60%' }} />
      </div>
    </div>
  )
}
