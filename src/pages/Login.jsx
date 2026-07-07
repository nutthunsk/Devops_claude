import { useState, useRef, useEffect } from 'react'
import { useApp } from '../store'
import { LANGS } from '../i18n'
import './Login.css'

const BrandMark = ({ className }) => (
  <span className={className} aria-hidden="true">
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 11l3.2 10L16 13.5 20.8 21 24 11" />
    </svg>
  </span>
)

export default function Login() {
  const { login, t, lang, setLang } = useApp()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false) // false | 'form' | 'demo'

  const isSignup = mode === 'signup'

  const emailError = !email
    ? t('login.errEmailRequired')
    : !/^\S+@\S+\.\S+$/.test(email)
      ? t('login.errEmailInvalid')
      : null
  const passwordError = !password
    ? t('login.errPwRequired')
    : password.length < 6
      ? t('login.errPwShort')
      : null
  const nameError = isSignup && !name.trim() ? t('login.errNameRequired') : null
  const invalid = Boolean(emailError || passwordError || nameError)

  const submit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true, name: true })
    if (invalid || busy) return
    setBusy('form')
    setTimeout(() => login(email), 900) // simulated auth — client-side only
  }

  // One-click demo access — fills the form so the flow stays legible.
  const demoLogin = () => {
    if (busy) return
    const demoEmail = 'demo@wealthshare.app'
    setMode('signin')
    setEmail(demoEmail)
    setPassword('demo-account')
    setTouched({})
    setBusy('demo')
    setTimeout(() => login(demoEmail), 900)
  }

  return (
    <div className="au-shell">
      {/* Brand panel — previews the real dashboard so login feels like the app */}
      <aside className="au-hero">
        <div className="au-brand">
          <BrandMark className="au-brand-mark" /> WealthShare
        </div>

        <div className="au-hero-copy">
          <h1 className="au-headline">{t('login.heroTitle')}</h1>
          <p className="au-subcopy">{t('login.heroSub')}</p>

          <div className="au-preview" aria-hidden="true">
            <div className="au-glasscard">
              <div className="au-tile-label">{t('dash.totalBalance')}</div>
              <div className="au-tile-value">฿145,000</div>
              <div className="au-tile-delta">▲ 4.4% <span className="vs">{t('dash.vsLastMonth')}</span></div>
              <svg className="au-spark" viewBox="0 0 320 46" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="au-sparkfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6ee7b7" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#6ee7b7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 38 L46 33 L92 35 L138 24 L184 27 L230 14 L276 17 L320 5 L320 46 L0 46 Z" fill="url(#au-sparkfill)" />
                <path d="M0 38 L46 33 L92 35 L138 24 L184 27 L230 14 L276 17 L320 5" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="320" cy="5" r="3" fill="#fff" />
              </svg>
            </div>

            <div className="au-chips">
              <div className="au-chip">
                <div className="au-chip-label"><span className="au-dot up" /> {t('dash.incomeMonth')}</div>
                <div className="au-chip-value">฿45,000</div>
              </div>
              <div className="au-chip">
                <div className="au-chip-label"><span className="au-dot down" /> {t('dash.expenseMonth')}</div>
                <div className="au-chip-value">฿18,200</div>
              </div>
            </div>
          </div>
        </div>

        <div className="au-hero-foot">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" />
          </svg>
          {t('login.heroTrust')}
        </div>
      </aside>

      {/* Form panel — reuses the app's own .field / .btn / tabs components */}
      <main className="au-panel">
        <div className="au-form">
          <div className="au-form-brand"><BrandMark className="brand-mark" /> WealthShare</div>

          <h2 className="au-title">{isSignup ? t('login.createHeading') : t('login.welcome')}</h2>
          <p className="au-lede">{isSignup ? t('login.createSub') : t('login.welcomeSub')}</p>

          <div className="auth-tabs" role="tablist">
            <button className={!isSignup ? 'active' : ''} role="tab" aria-selected={!isSignup} onClick={() => setMode('signin')}>{t('login.signIn')}</button>
            <button className={isSignup ? 'active' : ''} role="tab" aria-selected={isSignup} onClick={() => setMode('signup')}>{t('login.createAccount')}</button>
          </div>

          <form onSubmit={submit} noValidate>
            {isSignup && (
              <div className={`field${touched.name && nameError ? ' invalid' : ''}`}>
                <label htmlFor="auth-name">{t('login.fullName')}</label>
                <input
                  id="auth-name" type="text" placeholder={t('login.namePlaceholder')} value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                />
                {touched.name && nameError && <div className="field-error">{nameError}</div>}
              </div>
            )}

            <div className={`field${touched.email && emailError ? ' invalid' : ''}`}>
              <label htmlFor="auth-email">{t('login.email')}</label>
              <input
                id="auth-email" type="email" placeholder={t('login.emailPlaceholder')} value={email} autoFocus
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, email: true }))}
              />
              {touched.email && emailError && <div className="field-error">{emailError}</div>}
            </div>

            <div className={`field au-field-pw${touched.password && passwordError ? ' invalid' : ''}`}>
              <label htmlFor="auth-password">{t('login.password')}</label>
              <div className="au-input-wrap">
                <input
                  id="auth-password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                />
                <button
                  type="button" className="au-eyebtn"
                  aria-label={showPw ? t('login.hidePassword') : t('login.showPassword')}
                  aria-pressed={showPw}
                  onClick={() => setShowPw((v) => !v)}
                >
                  <span className={`au-eyeicon${showPw ? ' is-on' : ''}`}>
                    <Eye className="au-eye-open" />
                    <EyeOff className="au-eye-closed" />
                  </span>
                </button>
              </div>
              {touched.password && passwordError && <div className="field-error">{passwordError}</div>}
            </div>

            <button type="submit" className="btn btn-primary au-submit" disabled={!!busy}>
              {busy === 'form' && <span className="spinner" />}
              {busy === 'form' ? t('login.signingIn') : isSignup ? t('login.createAccount') : t('login.signIn')}
            </button>
          </form>

          <div className="au-divider" aria-hidden="true"><span>{t('login.or')}</span></div>

          <button type="button" className="btn btn-ghost au-submit" onClick={demoLogin} disabled={!!busy}>
            {busy === 'demo' && <span className="spinner dark" />}
            {busy === 'demo' ? t('login.signingIn') : t('login.demoSignIn')}
          </button>

          <div className="au-alt">
            {isSignup ? t('login.haveAccount') : t('login.noAccount')}{' '}
            <button onClick={() => setMode(isSignup ? 'signin' : 'signup')}>
              {isSignup ? t('login.signIn') : t('login.createAccount')}
            </button>
          </div>

          <div className="au-foot">
            <LangSwitcher lang={lang} setLang={setLang} />
            <div className="auth-hint" style={{ marginTop: 0 }}>{t('login.demoHint')}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Eye({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function EyeOff({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.42M6.1 6.1A13.3 13.3 0 0 0 2 11s3.5 7 10 7a9 9 0 0 0 4-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20" />
    </svg>
  )
}

/* Language switcher — a themed dropdown that reuses the app's tokens so it
   reads as part of the product. Closes on outside-click and Escape. */
function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = LANGS[lang] || LANGS.en

  return (
    <div className={`au-lang${open ? ' open' : ''}`} ref={ref}>
      <button
        type="button" className="au-lang-trigger"
        aria-haspopup="listbox" aria-expanded={open} aria-label="Language"
        onClick={() => setOpen((o) => !o)}
      >
        <GlobeIcon className="au-lang-globe" />
        <span className="au-lang-current">{current.native}</span>
        <CaretIcon className="au-lang-caret" />
      </button>

      <ul className="au-lang-menu" role="listbox" aria-label="Language" tabIndex={-1}>
        {Object.entries(LANGS).map(([code, l]) => {
          const active = lang === code
          return (
            <li key={code} role="option" aria-selected={active}>
              <button
                type="button" className={`au-lang-opt${active ? ' active' : ''}`}
                onClick={() => { setLang(code); setOpen(false) }}
              >
                <span className="au-lang-native">{l.native}</span>
                {l.label !== l.native && <span className="au-lang-sub">{l.label}</span>}
                {active && <CheckIcon className="au-lang-check" />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </svg>
  )
}
function CaretIcon({ className }) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
