import { useMemo, useState } from 'react'
import { useApp, fmtMoney } from '../store'
import { DonutChart } from '../components/charts'
import { TxList } from '../components/ui'
import TransactionModal from '../components/TransactionModal'

// Shared page for Income (type="income") and Expense (type="expense")
export default function Transactions({ type }) {
  const { transactions } = useApp()
  const [showAdd, setShowAdd] = useState(false)

  const isExpense = type === 'expense'
  const items = useMemo(
    () => transactions.filter((t) => t.type === type).sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, type],
  )
  const byCategory = useMemo(() => {
    const map = new Map()
    items.forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount))
    return [...map].map(([label, value]) => ({ label, value }))
  }, [items])
  const total = items.reduce((s, t) => s + t.amount, 0)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{isExpense ? 'Expenses' : 'Income'}</h1>
          <div className="page-sub">
            {items.length
              ? <>{items.length} record{items.length > 1 ? 's' : ''} · total{' '}
                  <strong style={{ color: isExpense ? 'var(--negative-dark)' : 'var(--positive-dark)' }}>
                    {fmtMoney(total)}
                  </strong></>
              : `Log your first ${type} to see the breakdown.`}
          </div>
        </div>
        <button
          className={`btn ${isExpense ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => setShowAdd(true)}
        >
          + Add {isExpense ? 'Expense' : 'Income'}
        </button>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">By category</div>
              <div className="card-sub">All records</div>
            </div>
          </div>
          {byCategory.length ? (
            <DonutChart data={byCategory} centerLabel="Total" size={168} />
          ) : (
            <div className="empty-sub" style={{ textAlign: 'center', padding: '32px 0' }}>
              Nothing to chart yet.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">History</div>
          </div>
          <TxList items={items} showAccount emptyText={`No ${type} records yet.`} />
        </div>
      </div>

      {showAdd && <TransactionModal initialType={type} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
