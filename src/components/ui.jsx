import { useEffect } from 'react'
import { fmtMoney, fmtDate, catEmoji } from '../store'

/* ---------------- Stat tile ---------------- */
export function StatTile({ label, value, delta, deltaDir, hero, tone }) {
  return (
    <div className="card stat-tile">
      <div className="stat-label">{label}</div>
      <div className={`stat-value${hero ? ' hero' : ''}`} style={tone ? { color: tone } : undefined}>
        {value}
      </div>
      {delta && (
        <div className={`stat-delta ${deltaDir}`}>
          {deltaDir === 'up' ? '▲' : '▼'} {delta} <span className="vs">vs last month</span>
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

export function PageSkeleton() {
  return (
    <div className="page">
      <Skeleton w={200} h={26} style={{ marginBottom: 8 }} />
      <Skeleton w={280} h={14} style={{ marginBottom: 24 }} />
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
        <SkeletonCard chart />
        <SkeletonCard lines={6} />
      </div>
    </div>
  )
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
  const sign = tx.type === 'income' ? '+' : '−'
  return (
    <div className="tx-row">
      <div className="tx-icon" aria-hidden="true">{catEmoji(tx.category)}</div>
      <div className="tx-info">
        <div className="tx-cat">{tx.category}</div>
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
