import { useMemo, useState } from 'react'
import { useApp, fmtMoney, todayISO } from '../store'
import { LineChart, DonutChart } from '../components/charts'
import { StatTile, TxList } from '../components/ui'
import TransactionModal from '../components/TransactionModal'
import { MOCK_TREND } from '../data/mock'

export default function Dashboard({ onNav }) {
  const { user, summary, transactions, t, tl } = useApp()
  const [modal, setModal] = useState(null)

  const month = todayISO().slice(0, 7)
  const expenseByCategory = useMemo(() => {
    const map = new Map()
    transactions
      .filter((tx) => tx.type === 'expense' && tx.date.startsWith(month))
      .forEach((tx) => map.set(tx.category, (map.get(tx.category) || 0) + tx.amount))
    return [...map].map(([cat, value]) => ({ label: tl('cat', cat), value }))
  }, [transactions, month, tl])

  const recent = transactions.slice(0, 6)
  const firstName = user.name.split(' ')[0]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('dash.greeting', { name: firstName })}</h1>
          <div className="page-sub">{t('dash.glance')}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setModal('income')}>{t('common.addIncome')}</button>
          <button className="btn btn-danger" onClick={() => setModal('expense')}>{t('common.addExpense')}</button>
        </div>
      </div>

      <div className="kpi-row">
        <StatTile label={t('dash.totalBalance')} value={fmtMoney(summary.total_balance)} hero delta="4.4%" deltaDir="up" vs={t('dash.vsLastMonth')} />
        <StatTile label={t('dash.incomeMonth')} value={fmtMoney(summary.total_income_this_month)} tone="var(--positive-dark)" />
        <StatTile label={t('dash.expenseMonth')} value={fmtMoney(summary.total_expense_this_month)} tone="var(--negative-dark)" />
        <StatTile label={t('dash.savedMonth')} value={fmtMoney(summary.total_savings_this_month)} />
      </div>

      <div className="dash-grid">
        <div className="card span-mobile">
          <div className="card-head">
            <div>
              <div className="card-title">{t('dash.balanceTrend')}</div>
              <div className="card-sub">{t('dash.balanceTrendSub')}</div>
            </div>
            <span className="line-key"><i /> {t('dash.balance')}</span>
          </div>
          <LineChart data={MOCK_TREND} />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{t('dash.expenseBreakdown')}</div>
              <div className="card-sub">{t('dash.byCategoryMonth')}</div>
            </div>
          </div>
          {expenseByCategory.length ? (
            <DonutChart data={expenseByCategory} centerLabel={t('dash.spent')} size={168} otherLabel={t('tx.otherLabel')} />
          ) : (
            <div className="empty-sub" style={{ textAlign: 'center', padding: '32px 0' }}>
              {t('dash.noExpenseMonth')}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">{t('dash.recent')}</div>
            <button
              className="btn btn-ghost"
              style={{ padding: '5px 12px', fontSize: 12.5 }}
              onClick={() => onNav('expense')}
            >
              {t('common.viewAll')}
            </button>
          </div>
          <TxList items={recent} showAccount />
        </div>
      </div>

      {modal && <TransactionModal initialType={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
