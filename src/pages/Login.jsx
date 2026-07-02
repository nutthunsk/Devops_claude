import { useState } from 'react'
import { useApp } from '../store'

export default function Login() {
  const { login } = useApp()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false)

  const emailError = !email
    ? 'Please enter your email'
    : !/^\S+@\S+\.\S+$/.test(email)
      ? 'Please enter a valid email address'
      : null
  const passwordError = !password
    ? 'Please enter your password'
    : password.length < 6
      ? 'Password must be at least 6 characters'
      : null
  const nameError = mode === 'signup' && !name.trim() ? 'Please enter your name' : null
  const invalid = Boolean(emailError || passwordError || nameError)

  const submit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true, name: true })
    if (invalid || busy) return
    setBusy(true)
    // Simulated auth round-trip — client-side only
    setTimeout(() => login(email), 800)
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 11l3.2 10L16 13.5 20.8 21 24 11" />
            </svg>
          </span>
          WealthShare
        </div>
        <div className="auth-tag">Track your money. Grow together.</div>

        <div className="auth-tabs" role="tablist">
          <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Sign in</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Create account</button>
        </div>

        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <div className={`field${touched.name && nameError ? ' invalid' : ''}`}>
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name" type="text" placeholder="Tanapat MoneyGuy" value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
              {touched.name && nameError && <div className="field-error">{nameError}</div>}
            </div>
          )}

          <div className={`field${touched.email && emailError ? ' invalid' : ''}`}>
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email" type="email" placeholder="you@example.com" value={email} autoFocus
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {touched.email && emailError && <div className="field-error">{emailError}</div>}
          </div>

          <div className={`field${touched.password && passwordError ? ' invalid' : ''}`}>
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password" type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            {touched.password && passwordError && <div className="field-error">{passwordError}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={busy}>
            {busy && <span className="spinner" />}
            {busy ? 'Signing in…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-hint">Demo app — any valid email and a 6+ character password will work.</div>
      </div>
    </div>
  )
}
