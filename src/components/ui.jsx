import { useEffect } from 'react'
import { fmtMoney, fmtDate, useApp } from '../store'
import { CategoryIcon } from './icons'

/* ---------------- Stat tile ---------------- */
export function StatTile({ label, value, delta, deltaDir, hero, tone, vs }) {
  return (
    <div className="card stat-tile">
      <div className="stat-label">{label}</div>
      <div className={`stat-value${hero ? ' hero' : ''}`} style={tone ? { color: tone } : undefined}>
        {value}
      </div>
      {delta && (
        <div className={`stat-delta ${deltaDir}`}>
          {deltaDir === 'up' ? '▲' : '▼'} {delta} <span className="vs">{vs}</span>
        </div>
      )}
    </div>
  )
}

/* ---------------- Modal / bottom sheet ---------------- */
export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-handle" />
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---------------- Skeletons ---------------- */
export function Skeleton({ w = '100%', h = 14, style }) {
  return <div className="skeleton" style={{ width: w, height: h, ...style }} />
}

export function SkeletonCard({ lines = 4, chart }) {
  return (
    <div className="card">
      <Skeleton w="45%" h={16} style={{ marginBottom: 16 }} />
      {chart ? (
        <Skeleton h={180} style={{ borderRadius: 12 }} />
      ) : (
        Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} w={`${90 - i * 12}%`} style={{ marginBottom: 12 }} />
        ))
      )}
    </div>
  )
}

function SkeletonPageHead({ actions = 0 }) {
  return (
    <div className="page-head">
      <div>
        <Skeleton w={200} h={26} style={{ marginBottom: 8 }} />
        <Skeleton w={280} h={14} />
      </div>
      {actions > 0 && (
        <div className="page-actions">
          {Array.from({ length: actions }).map((_, i) => (
            <Skeleton key={i} w={130} h={40} style={{ borderRadius: 10 }} />
          ))}
        </div>
      )}
    </div>
  )
}

// Donut chart card — circle placeholder matching DonutChart size={168}
function SkeletonDonutCard() {
  return (
    <div className="card">
      <Skeleton w="45%" h={16} style={{ marginBottom: 6 }} />
      <Skeleton w="60%" h={12} style={{ marginBottom: 20 }} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
        <Skeleton w={168} h={168} style={{ borderRadius: '50%' }} />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} w={`${70 - i * 10}%`} style={{ marginBottom: 10 }} />
      ))}
    </div>
  )
}

// Transaction list rows — icon + two text lines + amount, like TxList
function SkeletonTxRows({ rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0' }}>
      <Skeleton w={38} h={38} style={{ borderRadius: 11, flex: 'none' }} />
      <div style={{ flex: 1 }}>
        <Skeleton w={`${55 - (i % 3) * 8}%`} style={{ marginBottom: 6 }} />
        <Skeleton w="30%" h={11} />
      </div>
      <Skeleton w={72} h={15} style={{ flex: 'none' }} />
    </div>
  ))
}

function DashboardSkeleton() {
  return (
    <div className="page">
      <SkeletonPageHead actions={2} />
      <div className="kpi-row">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="card stat-tile" key={i}>
            <Skeleton w="60%" h={12} style={{ marginBottom: 12 }} />
            <Skeleton w="80%" h={24} />
          </div>
        ))}
      </div>
      <div className="dash-grid">
        <SkeletonCard chart />
        <SkeletonDonutCard />
        <div className="card">
          <Skeleton w="45%" h={16} style={{ marginBottom: 12 }} />
          <SkeletonTxRows rows={5} />
        </div>
      </div>
    </div>
  )
}

function AccountsSkeleton() {
  return (
    <div className="page">
      <SkeletonPageHead actions={1} />
      <div className="account-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="card account-card" key={i}>
            <Skeleton w={40} h={40} style={{ borderRadius: 11, marginBottom: 12 }} />
            <Skeleton w="45%" h={11} style={{ marginBottom: 8 }} />
            <Skeleton w="65%" h={15} style={{ marginBottom: 14 }} />
            <Skeleton w="55%" h={22} />
          </div>
        ))}
      </div>
    </div>
  )
}

function TransactionsSkeleton() {
  return (
    <div className="page">
      <SkeletonPageHead actions={1} />
      <div className="dash-grid tx-grid">
        <SkeletonDonutCard />
        <div className="card">
          <Skeleton w="35%" h={16} style={{ marginBottom: 12 }} />
          <SkeletonTxRows rows={6} />
        </div>
      </div>
    </div>
  )
}

function SavingsSkeleton() {
  return (
    <div className="page">
      <SkeletonPageHead actions={1} />
      <div className="dash-grid savings-grid">
        <div className="card">
          <div className="card-head">
            <div style={{ flex: 1 }}>
              <Skeleton w="40%" h={16} style={{ marginBottom: 6 }} />
              <Skeleton w="30%" h={12} />
            </div>
            <Skeleton w={160} h={34} style={{ borderRadius: 10 }} />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="goal-row" key={i}>
              <div className="goal-top">
                <Skeleton w={`${45 - i * 8}%`} h={15} />
                <Skeleton w={40} h={14} />
              </div>
              <Skeleton h={10} style={{ borderRadius: 999, marginTop: 10 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Skeleton w={110} h={12} />
                <Skeleton w={90} h={12} />
              </div>
            </div>
          ))}
        </div>
        <SkeletonDonutCard />
      </div>
    </div>
  )
}

function CommunitySkeleton() {
  return (
    <div className="page">
      <SkeletonPageHead actions={1} />
      <div className="feed-layout">
        <div className="feed">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="card post-card" key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Skeleton w={36} h={36} style={{ borderRadius: '50%', flex: 'none' }} />
                <div style={{ flex: 1 }}>
                  <Skeleton w={120} h={13} style={{ marginBottom: 6 }} />
                  <Skeleton w={70} h={11} />
                </div>
                <Skeleton w={64} h={22} style={{ borderRadius: 999 }} />
              </div>
              <Skeleton w="70%" h={17} style={{ marginBottom: 10 }} />
              <Skeleton style={{ marginBottom: 8 }} />
              <Skeleton w="85%" style={{ marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton w={72} h={30} style={{ borderRadius: 999 }} />
                <Skeleton w={110} h={30} style={{ borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
        <aside>
          <div className="card trending">
            <Skeleton w="55%" h={16} style={{ marginBottom: 16 }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 2px' }}>
                <Skeleton w={100} h={13} />
                <Skeleton w={56} h={13} />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="page">
      <SkeletonPageHead />
      <div className="settings-stack">
        <div className="card">
          <Skeleton w="35%" h={16} style={{ marginBottom: 6 }} />
          <Skeleton w="55%" h={12} style={{ marginBottom: 18 }} />
          <div className="theme-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} h={110} style={{ borderRadius: 12 }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="card" key={i}>
            <Skeleton w="35%" h={16} style={{ marginBottom: 6 }} />
            <Skeleton w="55%" h={12} style={{ marginBottom: 18 }} />
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div style={{ flex: 1 }}>
                  <Skeleton w="30%" h={14} style={{ marginBottom: 6 }} />
                  <Skeleton w="50%" h={11} />
                </div>
                <Skeleton w={140} h={36} style={{ borderRadius: 10 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton shaped like the page being loaded, keyed by nav page id
export function PageSkeleton({ page = 'dashboard' }) {
  switch (page) {
    case 'accounts': return <AccountsSkeleton />
    case 'income':
    case 'expense': return <TransactionsSkeleton />
    case 'savings': return <SavingsSkeleton />
    case 'community': return <CommunitySkeleton />
    case 'settings': return <SettingsSkeleton />
    default: return <DashboardSkeleton />
  }
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ title, sub, cta, onCta }) {
  return (
    <div className="empty-state">
      <PiggyIllustration />
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
      {cta && (
        <button className="btn btn-primary" onClick={onCta}>+ {cta}</button>
      )}
    </div>
  )
}

function PiggyIllustration() {
  return (
    <svg width="150" height="110" viewBox="0 0 150 110" fill="none" aria-hidden="true">
      <ellipse cx="75" cy="98" rx="52" ry="8" fill="#E5E7EB" />
      <path d="M38 62c0-20 17-34 38-34s37 14 37 33c0 12-6 21-15 27v8a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-3a49 49 0 0 1-18 0v3a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-8c-10-6-16-15-16-26z" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M64 30c2-7 9-12 14-12 0 6-2 11-6 14" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="55" cy="55" r="3.5" fill="#0F766E" />
      <path d="M36 58c-5 1-8 5-8 10 0 4 2 7 6 8" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="68" y="20" width="18" height="4" rx="2" fill="#0F766E" />
      <circle cx="98" cy="12" r="9" fill="#10B981" opacity="0.9" />
      <text x="98" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">฿</text>
      <path d="M98 21v3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ---------------- Transaction row / list ---------------- */
export function TxRow({ tx, showAccount = true }) {
  const { tl } = useApp()
  const sign = tx.type === 'income' ? '+' : '−'
  return (
    <div className="tx-row">
      <div className="tx-icon" aria-hidden="true"><CategoryIcon category={tx.category} /></div>
      <div className="tx-info">
        <div className="tx-cat">{tl('cat', tx.category)}</div>
        <div className="tx-note">{tx.note || (showAccount ? tx.account : '')}</div>
      </div>
      <div className="tx-right">
        <div className={`tx-amount ${tx.type}`}>{sign}{fmtMoney(tx.amount, 2)}</div>
        <div className="tx-meta">
          {fmtDate(tx.date)}{showAccount && tx.note ? ` · ${tx.account}` : ''}
        </div>
      </div>
    </div>
  )
}

export function TxList({ items, showAccount, emptyText = 'No transactions yet.' }) {
  if (!items.length) return <div className="empty-sub" style={{ textAlign: 'center', padding: '24px 0' }}>{emptyText}</div>
  return (
    <div className="tx-list">
      {items.map((tx) => <TxRow key={tx.id} tx={tx} showAccount={showAccount} />)}
    </div>
  )
}
