import { useState } from 'react'
import { useApp, fmtMoney } from '../store'
import { Modal, EmptyState } from '../components/ui'

const TYPE_ICONS = { 'Bank Account': '🏦', Cash: '💵', 'Credit Card': '💳', 'E-Wallet': '📱', Investment: '📈' }
const ACCOUNT_TYPES = Object.keys(TYPE_ICONS)

export default function Accounts() {
  const { accounts, addAccount, deleteAccount } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const total = accounts.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Accounts</h1>
          <div className="page-sub">
            {accounts.length
              ? <>Total across {accounts.length} account{accounts.length > 1 ? 's' : ''}: <strong style={{ color: 'var(--ink)' }}>{fmtMoney(total)}</strong></>
              : 'Where your money lives.'}
          </div>
        </div>
        {accounts.length > 0 && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Account</button>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No accounts added yet"
            sub="Let's create your first account! Add your bank, cash wallet or credit card to start tracking."
            cta="Create your first account"
            onCta={() => setShowAdd(true)}
          />
        </div>
      ) : (
        <div className="account-grid">
          {accounts.map((a) => (
            <div className="card account-card" key={a.id}>
              <button
                className="account-del"
                aria-label={`Remove ${a.name}`}
                title="Remove account"
                onClick={() => deleteAccount(a.id)}
              >
                ✕
              </button>
              <div className="account-icon" aria-hidden="true">{TYPE_ICONS[a.type] || '💰'}</div>
              <div className="account-type">{a.type}</div>
              <div className="account-name">{a.name}</div>
              <div className="account-balance">{fmtMoney(a.balance, 2)}</div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddAccountModal onAdd={addAccount} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function AddAccountModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Bank Account')
  const [balance, setBalance] = useState('')
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const nameError = !name.trim() ? 'Please enter an account name' : null
  const balanceNum = parseFloat(balance || '0')
  const balanceError = Number.isNaN(balanceNum) || balanceNum < 0 ? 'Please enter a valid starting balance' : null
  const invalid = Boolean(nameError || balanceError)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || saving) return
    setSaving(true)
    setTimeout(() => {
      onAdd({ name: name.trim(), type, balance: balanceNum })
      onClose()
    }, 500)
  }

  return (
    <Modal title="Add Account" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className={`field${touched && nameError ? ' invalid' : ''}`}>
          <label htmlFor="acc-name">Account name</label>
          <input id="acc-name" autoFocus placeholder="e.g. KBank Main" value={name} onChange={(e) => setName(e.target.value)} />
          {touched && nameError && <div className="field-error">{nameError}</div>}
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="acc-type">Type</label>
            <select id="acc-type" value={type} onChange={(e) => setType(e.target.value)}>
              {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={`field${touched && balanceError ? ' invalid' : ''}`}>
            <label htmlFor="acc-balance">Starting balance (฿)</label>
            <input id="acc-balance" type="number" inputMode="decimal" step="0.01" placeholder="0.00" value={balance} onChange={(e) => setBalance(e.target.value)} />
            {touched && balanceError && <div className="field-error">{balanceError}</div>}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving || (touched && invalid)}>
            {saving && <span className="spinner" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
