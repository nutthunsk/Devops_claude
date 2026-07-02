import { useState } from 'react'
import { useApp, fmtMoney } from '../store'
import { DonutChart } from '../components/charts'
import { Modal, EmptyState } from '../components/ui'
import { MOCK_PORTFOLIO } from '../data/mock'

export default function Savings() {
  const { goals, addGoal, deleteGoal } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const portfolioTotal = MOCK_PORTFOLIO.reduce((s, d) => s + d.value, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Savings &amp; Investment</h1>
          <div className="page-sub">Goals you're saving toward, and where your portfolio sits.</div>
        </div>
        {goals.length > 0 && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ New Goal</button>
        )}
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Saving goals</div>
              <div className="card-sub">{goals.length ? `${goals.length} active goal${goals.length > 1 ? 's' : ''}` : ' '}</div>
            </div>
          </div>
          {goals.length === 0 ? (
            <EmptyState
              title="No saving goals yet"
              sub="Give your money a mission! Set a target and watch the progress bar fill up."
              cta="Create your first goal"
              onCta={() => setShowAdd(true)}
            />
          ) : (
            goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100))
              return (
                <div className="goal-row" key={g.id}>
                  <div className="goal-top">
                    <div className="goal-name">{g.emoji} {g.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span className="goal-pct">{pct}%</span>
                      <button
                        className="modal-close"
                        style={{ width: 24, height: 24, fontSize: 12 }}
                        aria-label={`Remove goal ${g.name}`}
                        title="Remove goal"
                        onClick={() => deleteGoal(g.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="meter" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label={g.name}>
                    <div className="meter-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="goal-amounts">
                    <span>{fmtMoney(g.current)} saved</span>
                    <span>of {fmtMoney(g.target)}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Portfolio allocation</div>
              <div className="card-sub">Simulated · {fmtMoney(portfolioTotal)} invested</div>
            </div>
          </div>
          <DonutChart data={MOCK_PORTFOLIO} centerLabel="Invested" size={168} />
        </div>
      </div>

      {showAdd && <AddGoalModal onAdd={addGoal} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function AddGoalModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)

  const nameError = !name.trim() ? 'Please enter a goal name' : null
  const targetNum = parseFloat(target)
  const targetError = target === '' || Number.isNaN(targetNum) || targetNum <= 0 ? 'Please enter a valid target amount' : null
  const currentNum = parseFloat(current || '0')
  const currentError = Number.isNaN(currentNum) || currentNum < 0 ? 'Please enter a valid amount' : null
  const invalid = Boolean(nameError || targetError || currentError)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || saving) return
    setSaving(true)
    setTimeout(() => {
      onAdd({ name: name.trim(), emoji: '🎯', target: targetNum, current: currentNum })
      onClose()
    }, 500)
  }

  return (
    <Modal title="New Saving Goal" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className={`field${touched && nameError ? ' invalid' : ''}`}>
          <label htmlFor="goal-name">Goal name</label>
          <input id="goal-name" autoFocus placeholder="e.g. Emergency Fund" value={name} onChange={(e) => setName(e.target.value)} />
          {touched && nameError && <div className="field-error">{nameError}</div>}
        </div>
        <div className="field-row">
          <div className={`field${touched && targetError ? ' invalid' : ''}`}>
            <label htmlFor="goal-target">Target (฿)</label>
            <input id="goal-target" type="number" inputMode="decimal" placeholder="50,000" value={target} onChange={(e) => setTarget(e.target.value)} />
            {touched && targetError && <div className="field-error">{targetError}</div>}
          </div>
          <div className={`field${touched && currentError ? ' invalid' : ''}`}>
            <label htmlFor="goal-current">Already saved (฿)</label>
            <input id="goal-current" type="number" inputMode="decimal" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} />
            {touched && currentError && <div className="field-error">{currentError}</div>}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving || (touched && invalid)}>
            {saving && <span className="spinner" />}
            {saving ? 'Saving…' : 'Create goal'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
