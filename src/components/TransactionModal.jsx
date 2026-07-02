import { useState } from 'react'
import { Modal } from './ui'
import { useApp, todayISO, toBase, CURRENCIES } from '../store'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/mock'

export default function TransactionModal({ initialType = 'expense', onClose }) {
  const { accounts, addTransaction, currency, t, tl } = useApp()
  const [type, setType] = useState(initialType)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState(accounts[0]?.name || '')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState({})
  const [saving, setSaving] = useState(false)

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
  const symbol = CURRENCIES[currency].symbol

  // Client-side validation (PRD §5)
  const amountNum = parseFloat(amount)
  const amountError =
    amount === '' || Number.isNaN(amountNum) || amountNum <= 0
      ? t('tx.errAmount')
      : null
  const categoryError = !category ? t('tx.errCategory') : null
  const invalid = Boolean(amountError || categoryError)

  const submit = (e) => {
    e.preventDefault()
    setTouched({ amount: true, category: true })
    if (invalid || saving) return
    setSaving(true)
    // Simulated 0.5 s network lag, then append to local state (PRD §5 step 4).
    // The amount is typed in the active currency; store it in the THB base.
    setTimeout(() => {
      addTransaction({ type, amount: toBase(amountNum), category, account, date, note: note.trim() })
      onClose()
    }, 500)
  }

  return (
    <Modal title={type === 'expense' ? t('tx.addExpense') : t('tx.addIncome')} onClose={onClose}>
      <div className="type-toggle" role="tablist" aria-label={t('tx.category')}>
        <button
          type="button"
          className={type === 'income' ? 'on-income' : ''}
          onClick={() => { setType('income'); setCategory('') }}
        >
          <TypeGlyph dir="up" /> {t('tx.income')}
        </button>
        <button
          type="button"
          className={type === 'expense' ? 'on-expense' : ''}
          onClick={() => { setType('expense'); setCategory('') }}
        >
          <TypeGlyph dir="down" /> {t('tx.expense')}
        </button>
      </div>

      <form onSubmit={submit} noValidate>
        <div className={`field${touched.amount && amountError ? ' invalid' : ''}`}>
          <label htmlFor="tx-amount">{t('tx.amount')} ({symbol})</label>
          <input
            id="tx-amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            value={amount}
            autoFocus
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, amount: true }))}
          />
          {touched.amount && amountError && <div className="field-error">{amountError}</div>}
        </div>

        <div className={`field${touched.category && categoryError ? ' invalid' : ''}`}>
          <label htmlFor="tx-category">{t('tx.category')}</label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setTouched((s) => ({ ...s, category: true })) }}
            onBlur={() => setTouched((s) => ({ ...s, category: true }))}
          >
            <option value="" disabled>{t('tx.selectCategory')}</option>
            {categories.map((c) => <option key={c} value={c}>{tl('cat', c)}</option>)}
          </select>
          {touched.category && categoryError && <div className="field-error">{categoryError}</div>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="tx-account">{t('tx.accountUsed')}</label>
            <select id="tx-account" value={account} onChange={(e) => setAccount(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tx-date">{t('tx.date')}</label>
            <input id="tx-date" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="tx-note">{t('tx.note')} <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>{t('tx.optional')}</span></label>
          <textarea id="tx-note" rows="2" placeholder={t('tx.notePlaceholder')} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>{t('common.cancel')}</button>
          <button
            type="submit"
            className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-primary'}`}
            disabled={invalid || saving}
          >
            {saving && <span className="spinner" />}
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function TypeGlyph({ dir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ verticalAlign: '-2px' }}>
      {dir === 'up'
        ? <path d="M12 19V5m0 0-6 6m6-6 6 6" />
        : <path d="M12 5v14m0 0 6-6m-6 6-6-6" />}
    </svg>
  )
}
