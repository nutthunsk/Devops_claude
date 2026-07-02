import { useState } from 'react'
import { useApp, CURRENCIES, fmtMoney } from '../store'
import { LANGS } from '../i18n'

export default function Settings() {
  const { user, updateProfile, theme, setTheme, currency, setCurrency, lang, setLang, resetData, t, tl } = useApp()

  const themeOptions = [
    { id: 'light', label: t('settings.light'), hint: t('settings.lightHint') },
    { id: 'dark', label: t('settings.dark'), hint: t('settings.darkHint') },
    { id: 'system', label: t('settings.system'), hint: t('settings.systemHint') },
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('settings.title')}</h1>
          <div className="page-sub">{t('settings.subtitle')}</div>
        </div>
      </div>

      <div className="settings-stack">
        {/* Appearance — the theme switcher */}
        <section className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{t('settings.appearance')}</div>
              <div className="card-sub">{t('settings.appearanceSub')}</div>
            </div>
          </div>
          <div className="theme-grid" role="radiogroup" aria-label={t('settings.appearance')}>
            {themeOptions.map((opt) => (
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
        <ProfileSection user={user} onSave={updateProfile} t={t} />

        {/* Preferences — language + currency */}
        <section className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{t('settings.preferences')}</div>
              <div className="card-sub">{t('settings.preferencesSub')}</div>
            </div>
          </div>

          <div className="setting-row" style={{ borderBottom: '1px solid var(--gridline)', paddingBottom: 14, marginBottom: 4 }}>
            <div>
              <div className="setting-label">{t('settings.language')}</div>
              <div className="setting-desc">{t('settings.languageSub')}</div>
            </div>
            <select
              className="setting-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t('settings.language')}
            >
              {Object.entries(LANGS).map(([code, l]) => (
                <option key={code} value={code}>{l.native} ({code.toUpperCase()})</option>
              ))}
            </select>
          </div>

          <div className="setting-row">
            <div>
              <div className="setting-label">{t('settings.currency')}</div>
              <div className="setting-desc">{t('settings.currencySub', { sample: fmtMoney(1250) })}</div>
            </div>
            <select
              className="setting-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label={t('settings.currency')}
            >
              {Object.entries(CURRENCIES).map(([code, c]) => (
                <option key={code} value={code}>{c.symbol} {code} — {tl('ccy', c.label)}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Data & privacy */}
        <DataSection onReset={resetData} t={t} />

        <div className="settings-about">{t('settings.about')}</div>
      </div>
    </div>
  )
}

function ProfileSection({ user, onSave, t }) {
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
          <div className="card-title">{t('settings.profile')}</div>
          <div className="card-sub">{t('settings.profileSub')}</div>
        </div>
      </div>
      <div className="profile-row">
        <img className="profile-avatar" src={user.avatar} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="field" style={{ marginBottom: 10 }}>
            <label htmlFor="set-name">{t('settings.displayName')}</label>
            <input id="set-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="set-email">{t('settings.email')}</label>
            <input id="set-email" value={user.email} disabled />
          </div>
        </div>
      </div>
      <div className="form-actions" style={{ marginTop: 16 }}>
        {saved && <span className="save-flash">{t('settings.saved')}</span>}
        <button className="btn btn-primary" onClick={save} disabled={!dirty}>{t('settings.saveChanges')}</button>
      </div>
    </section>
  )
}

function DataSection({ onReset, t }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <div className="card-title">{t('settings.dataPrivacy')}</div>
          <div className="card-sub">{t('settings.dataPrivacySub')}</div>
        </div>
      </div>
      <div className="setting-row">
        <div>
          <div className="setting-label">{t('settings.resetData')}</div>
          <div className="setting-desc">{t('settings.resetDataSub')}</div>
        </div>
        {confirming ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setConfirming(false)}>{t('common.cancel')}</button>
            <button className="btn btn-danger" onClick={() => { onReset(); setConfirming(false) }}>{t('settings.confirmReset')}</button>
          </div>
        ) : (
          <button className="btn btn-ghost" onClick={() => setConfirming(true)}>{t('settings.reset')}</button>
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
