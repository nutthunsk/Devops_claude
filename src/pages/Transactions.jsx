import { useMemo, useState } from 'react'
import { useApp, fmtMoney } from '../store'
import { DonutChart } from '../components/charts'
import { TxList } from '../components/ui'
import TransactionModal from '../components/TransactionModal'

// Shared page for Income (type="income") and Expense (type="expense")
export default function Transactions({ type }) {
  const { transactions, t, tl } = useApp()
  const [showAdd, setShowAdd] = useState(false)

  const isExpense = type === 'expense'
  const items = useMemo(
    () => transactions.filter((tx) => tx.type === type).sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, type],
  )
  const byCategory = useMemo(() => {
    const map = new Map()
    items.forEach((tx) => map.set(tx.category, (map.get(tx.category) || 0) + tx.amount))
    return [...map].map(([cat, value]) => ({ label: tl('cat', cat), value }))
  }, [items, tl])
  const total = items.reduce((s, tx) => s + tx.amount, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{isExpense ? t('tx.expenseTitle') : t('tx.incomeTitle')}</h1>
          <div className="page-sub">
            {items.length
              ? <>{t('tx.records', { n: items.length, total: '' })}
                  <strong style={{ color: isExpense ? 'var(--negative-dark)' : 'var(--positive-dark)' }}>
                    {fmtMoney(total)}
                  </strong></>
              : isExpense ? t('tx.logFirstExpense') : t('tx.logFirstIncome')}
          </div>
        </div>
        <button
          className={`btn ${isExpense ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => setShowAdd(true)}
        >
          {isExpense ? t('common.addExpense') : t('common.addIncome')}
        </button>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{t('tx.byCategory')}</div>
              <div className="card-sub">{t('tx.allRecords')}</div>
            </div>
          </div>
          {byCategory.length ? (
            <DonutChart data={byCategory} centerLabel={t('tx.total')} size={168} otherLabel={t('tx.otherLabel')} />
          ) : (
            <div className="empty-sub" style={{ textAlign: 'center', padding: '32px 0' }}>
              {t('tx.nothingToChart')}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">{t('tx.history')}</div>
          </div>
          <TxList items={items} showAccount emptyText={isExpense ? t('tx.noExpense') : t('tx.noIncome')} />
        </div>
      </div>

      {showAdd && <TransactionModal initialType={type} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
