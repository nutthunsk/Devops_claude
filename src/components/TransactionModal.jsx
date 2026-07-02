import { useState } from 'react'
import { Modal } from './ui'
import { useApp, todayISO } from '../store'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/mock'

export default function TransactionModal({ initialType = 'expense', onClose }) {
  const { accounts, addTransaction } = useApp()
  const [type, setType] = useState(initialType)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState(accounts[0]?.name || '')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [touched, setTouched] = useState({})
  const [saving, setSaving] = useState(false)

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  // Client-side validation (PRD §5)
  const amountNum = parseFloat(amount)
  const amountError =
    amount === '' || Number.isNaN(amountNum) || amountNum <= 0
      ? 'Please enter a valid amount'
      : null
  const categoryError = !category ? 'Please select a category' : null
  const invalid = Boolean(amountError || categoryError)

  const submit = (e) => {
    e.preventDefault()
    setTouched({ amount: true, category: true })
    if (invalid || saving) return
    setSaving(true)
    // Simulated 0.5 s network lag, then append to local state (PRD §5 step 4)
    setTimeout(() => {
      addTransaction({ type, amount: amountNum, category, account, date, note: note.trim() })
      onClose()
    }, 500)
  }

  return (
    <Modal title={type === 'expense' ? 'Add Expense' : 'Add Income'} onClose={onClose}>
      <div className="type-toggle" role="tablist" aria-label="Transaction type">
        <button
          type="button"
          className={type === 'income' ? 'on-income' : ''}
          onClick={() => { setType('income'); setCategory('') }}
        >
          ↑ Income
        </button>
        <button
          type="button"
          className={type === 'expense' ? 'on-expense' : ''}
          onClick={() => { setType('expense'); setCategory('') }}
        >
          ↓ Expense
        </button>
      </div>

      <form onSubmit={submit} noValidate>
        <div className={`field${touched.amount && amountError ? ' invalid' : ''}`}>
          <label htmlFor="tx-amount">Amount (฿)</label>
          <input
            id="tx-amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            placeholder="0.00"
            value={amount}
            autoFocus
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          />
          {touched.amount && amountError && <div className="field-error">{amountError}</div>}
        </div>

        <div className={`field${touched.category && categoryError ? ' invalid' : ''}`}>
          <label htmlFor="tx-category">Category</label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setTouched((t) => ({ ...t, category: true })) }}
            onBlur={() => setTouched((t) => ({ ...t, category: true }))}
          >
            <option value="" disabled>Select a category…</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {touched.category && categoryError && <div className="field-error">{categoryError}</div>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="tx-account">Account used</label>
            <select id="tx-account" value={account} onChange={(e) => setAccount(e.target.value)}>
              {accounts.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tx-date">Date</label>
            <input id="tx-date" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="tx-note">Note <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>(optional)</span></label>
          <textarea id="tx-note" rows="2" placeholder="What was this for?" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button
            type="submit"
            className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-primary'}`}
            disabled={invalid || saving}
          >
            {saving && <span className="spinner" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
