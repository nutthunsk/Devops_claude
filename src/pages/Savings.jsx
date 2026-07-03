import { useMemo, useState } from 'react'
import { useApp, fmtMoney, toBase, CURRENCIES } from '../store'
import { DonutChart } from '../components/charts'
import { Modal, EmptyState } from '../components/ui'
import { MOCK_PORTFOLIO } from '../data/mock'

// Older goals in storage predate the category field — treat them as savings.
const goalCategory = (g) => g.category || 'savings'

export default function Savings() {
  const { goals, addGoal, deleteGoal, t, tl } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [category, setCategory] = useState('savings')
  const isInvest = category === 'investment'

  const shownGoals = goals.filter((g) => goalCategory(g) === category)

  const portfolioTotal = MOCK_PORTFOLIO.reduce((s, d) => s + d.value, 0)
  const portfolioData = useMemo(
    () => MOCK_PORTFOLIO.map((d) => ({ label: tl('portfolio', d.label), value: d.value })),
    [tl],
  )

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('savings.title')}</h1>
          <div className="page-sub">{t('savings.subtitle')}</div>
        </div>
        {shownGoals.length > 0 && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>{t('savings.newGoal')}</button>
        )}
      </div>

      <div className="dash-grid savings-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{isInvest ? t('savings.investGoals') : t('savings.goals')}</div>
              <div className="card-sub">{shownGoals.length ? t('savings.activeGoals', { n: shownGoals.length }) : ' '}</div>
            </div>
            {/* Switch between saving goals and investment goals */}
            <div className="seg" role="tablist" aria-label={t('savings.goalType')}>
              <button
                role="tab"
                aria-selected={!isInvest}
                className={!isInvest ? 'active' : ''}
                onClick={() => setCategory('savings')}
              >
                {t('savings.catSavings')}
              </button>
              <button
                role="tab"
                aria-selected={isInvest}
                className={isInvest ? 'active' : ''}
                onClick={() => setCategory('investment')}
              >
                {t('savings.catInvestment')}
              </button>
            </div>
          </div>
          {shownGoals.length === 0 ? (
            <EmptyState
              title={isInvest ? t('savings.emptyInvestTitle') : t('savings.emptyTitle')}
              sub={isInvest ? t('savings.emptyInvestSub') : t('savings.emptySub')}
              cta={isInvest ? t('savings.emptyInvestCta') : t('savings.emptyCta')}
              onCta={() => setShowAdd(true)}
            />
          ) : (
            shownGoals.map((g) => {
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
                        aria-label={`${t('settings.reset')} ${g.name}`}
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
                    <span>{t(isInvest ? 'savings.investedAmount' : 'savings.saved', { amount: fmtMoney(g.current) })}</span>
                    <span>{t('savings.of', { amount: fmtMoney(g.target) })}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{t('savings.portfolio')}</div>
              <div className="card-sub">{t('savings.portfolioSub', { amount: fmtMoney(portfolioTotal) })}</div>
            </div>
          </div>
          <DonutChart data={portfolioData} centerLabel={t('savings.invested')} size={168} otherLabel={t('tx.otherLabel')} />
        </div>
      </div>

      {showAdd && <AddGoalModal initialCategory={category} onAdd={addGoal} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function AddGoalModal({ initialCategory, onAdd, onClose }) {
  const { currency, t } = useApp()
  const [category, setCategory] = useState(initialCategory || 'savings')
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [touched, setTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const symbol = CURRENCIES[currency].symbol
  const isInvest = category === 'investment'

  const nameError = !name.trim() ? t('savings.errName') : null
  const targetNum = parseFloat(target)
  const targetError = target === '' || Number.isNaN(targetNum) || targetNum <= 0 ? t('savings.errTarget') : null
  const currentNum = parseFloat(current || '0')
  const currentError = Number.isNaN(currentNum) || currentNum < 0 ? t('savings.errSaved') : null
  const invalid = Boolean(nameError || targetError || currentError)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || saving) return
    setSaving(true)
    setTimeout(() => {
      onAdd({
        name: name.trim(),
        emoji: isInvest ? '📈' : '🎯',
        target: toBase(targetNum),
        current: toBase(currentNum),
        category,
      })
      onClose()
    }, 500)
  }

  return (
    <Modal title={isInvest ? t('savings.modalTitleInvest') : t('savings.modalTitle')} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <div className="type-toggle" role="radiogroup" aria-label={t('savings.goalType')}>
          <button
            type="button"
            role="radio"
            aria-checked={!isInvest}
            className={!isInvest ? 'on-income' : ''}
            onClick={() => setCategory('savings')}
          >
            🎯 {t('savings.catSavings')}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isInvest}
            className={isInvest ? 'on-income' : ''}
            onClick={() => setCategory('investment')}
          >
            📈 {t('savings.catInvestment')}
          </button>
        </div>
        <div className={`field${touched && nameError ? ' invalid' : ''}`}>
          <label htmlFor="goal-name">{t('savings.goalName')}</label>
          <input
            id="goal-name" autoFocus
            placeholder={isInvest ? t('savings.investNamePlaceholder') : 'Emergency Fund'}
            value={name} onChange={(e) => setName(e.target.value)}
          />
          {touched && nameError && <div className="field-error">{nameError}</div>}
        </div>
        <div className="field-row">
          <div className={`field${touched && targetError ? ' invalid' : ''}`}>
            <label htmlFor="goal-target">{t('savings.target')} ({symbol})</label>
            <input id="goal-target" type="number" inputMode="decimal" placeholder="50,000" value={target} onChange={(e) => setTarget(e.target.value)} />
            {touched && targetError && <div className="field-error">{targetError}</div>}
          </div>
          <div className={`field${touched && currentError ? ' invalid' : ''}`}>
            <label htmlFor="goal-current">{t(isInvest ? 'savings.alreadyInvested' : 'savings.already')} ({symbol})</label>
            <input id="goal-current" type="number" inputMode="decimal" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} />
            {touched && currentError && <div className="field-error">{currentError}</div>}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>{t('common.cancel')}</button>
          <button type="submit" className="btn btn-primary" disabled={saving || (touched && invalid)}>
            {saving && <span className="spinner" />}
            {saving ? t('common.saving') : t('savings.createGoal')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
