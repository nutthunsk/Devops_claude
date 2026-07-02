import { useMemo, useState } from 'react'
import { useApp, fmtMoney, todayISO } from '../store'
import { LineChart, DonutChart } from '../components/charts'
import { StatTile, TxList } from '../components/ui'
import TransactionModal from '../components/TransactionModal'
import { MOCK_TREND } from '../data/mock'

export default function Dashboard({ onNav }) {
  const { user, summary, transactions } = useApp()
  const [modal, setModal] = useState(null)

  const month = todayISO().slice(0, 7)
  const expenseByCategory = useMemo(() => {
    const map = new Map()
    transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(month))
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount))
    return [...map].map(([label, value]) => ({ label, value }))
  }, [transactions, month])

  const recent = transactions.slice(0, 6)
  const firstName = user.name.split(' ')[0]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Good day, {firstName} 👋</h1>
          <div className="page-sub">Here's your money at a glance — July 2026.</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setModal('income')}>+ Add Income</button>
          <button className="btn btn-danger" onClick={() => setModal('expense')}>+ Add Expense</button>
        </div>
      </div>

      <div className="kpi-row">
        <StatTile label="Total balance" value={fmtMoney(summary.total_balance)} hero delta="4.4%" deltaDir="up" />
        <StatTile label="Income this month" value={fmtMoney(summary.total_income_this_month)} tone="var(--positive-dark)" />
        <StatTile label="Expenses this month" value={fmtMoney(summary.total_expense_this_month)} tone="var(--negative-dark)" />
        <StatTile label="Saved this month" value={fmtMoney(summary.total_savings_this_month)} />
      </div>

      <div className="dash-grid">
        <div className="card span-mobile">
          <div className="card-head">
            <div>
              <div className="card-title">Balance trend</div>
              <div className="card-sub">Total balance, last 8 months</div>
            </div>
            <span className="line-key"><i /> Balance</span>
          </div>
          <LineChart data={MOCK_TREND} />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Expense breakdown</div>
              <div className="card-sub">This month, by category</div>
            </div>
          </div>
          {expenseByCategory.length ? (
            <DonutChart data={expenseByCategory} centerLabel="Spent" size={168} />
          ) : (
            <div className="empty-sub" style={{ textAlign: 'center', padding: '32px 0' }}>
              No expenses logged this month yet.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Recent transactions</div>
            <button
              className="btn btn-ghost"
              style={{ padding: '5px 12px', fontSize: 12.5 }}
              onClick={() => onNav('expense')}
            >
              View all
            </button>
          </div>
          <TxList items={recent} showAccount />
        </div>
      </div>

      {modal && <TransactionModal initialType={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
