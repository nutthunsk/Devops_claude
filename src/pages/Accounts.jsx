import { useState } from 'react'
import { useApp, fmtMoney, toBase, CURRENCIES } from '../store'
import { Modal, EmptyState } from '../components/ui'
import { AccountTypeIcon } from '../components/icons'

const ACCOUNT_TYPES = ['Bank Account', 'Cash', 'Credit Card', 'E-Wallet', 'Investment']

export default function Accounts() {
  const { accounts, addAccount, deleteAccount, t, tl } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const total = accounts.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('accounts.title')}</h1>
          <div className="page-sub">
            {accounts.length
              ? <>{t('accounts.totalAcross', { n: accounts.length })} <strong style={{ color: 'var(--ink)' }}>{fmtMoney(total)}</strong></>
              : t('accounts.subtitle')}
          </div>
        </div>
        {accounts.length > 0 && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>{t('accounts.add')}</button>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="card">
          <EmptyState
            title={t('accounts.emptyTitle')}
            sub={t('accounts.emptySub')}
            cta={t('accounts.emptyCta')}
            onCta={() => setShowAdd(true)}
          />
        </div>
      ) : (
        <div className="account-grid">
          {accounts.map((a) => (
            <div className="card account-card" key={a.id}>
              <button
                className="account-del"
                aria-label={`${t('settings.reset')} ${a.name}`}
                onClick={() => deleteAccount(a.id)}
              >
                ✕
              </button>
              <div className="account-icon" aria-hidden="true"><AccountTypeIcon type={a.type} /></div>
              <div className="account-type">{tl('accType', a.type)}</div>
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
  const { currency, t, tl } = useApp()
  const [name, setName] = useState('')
  const [type, setType] = useState('Bank Account')
  const [balance, setBalance] = useState('')
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const symbol = CURRENCIES[currency].symbol

  const nameError = !name.trim() ? t('accounts.errName') : null
  const balanceNum = parseFloat(balance || '0')
  const balanceError = Number.isNaN(balanceNum) || balanceNum < 0 ? t('accounts.errBalance') : null
  const invalid = Boolean(nameError || balanceError)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || saving) return
    setSaving(true)
    setTimeout(() => {
      onAdd({ name: name.trim(), type, balance: toBase(balanceNum) })
      onClose()
    }, 500)
  }

  return (
    <Modal title={t('accounts.modalTitle')} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className={`field${touched && nameError ? ' invalid' : ''}`}>
          <label htmlFor="acc-name">{t('accounts.name')}</label>
          <input id="acc-name" autoFocus placeholder={t('accounts.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} />
          {touched && nameError && <div className="field-error">{nameError}</div>}
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="acc-type">{t('accounts.type')}</label>
            <select id="acc-type" value={type} onChange={(e) => setType(e.target.value)}>
              {ACCOUNT_TYPES.map((tp) => <option key={tp} value={tp}>{tl('accType', tp)}</option>)}
            </select>
          </div>
          <div className={`field${touched && balanceError ? ' invalid' : ''}`}>
            <label htmlFor="acc-balance">{t('accounts.startBalance')} ({symbol})</label>
            <input id="acc-balance" type="number" inputMode="decimal" step="0.01" placeholder="0.00" value={balance} onChange={(e) => setBalance(e.target.value)} />
            {touched && balanceError && <div className="field-error">{balanceError}</div>}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>{t('common.cancel')}</button>
          <button type="submit" className="btn btn-primary" disabled={saving || (touched && invalid)}>
            {saving && <span className="spinner" />}
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
