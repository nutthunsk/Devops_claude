import { useMemo, useRef, useState } from 'react'
import { fmtMoney, convert } from '../store'

// Validated categorical order — fixed, assigned in sequence, never cycled.
// Slots 2 & 6 sit below 3:1 on white: relief = the value legend beside each donut.
export const SERIES = ['#0d9488', '#eda100', '#2a78d6', '#eb6834', '#4a3aa7', '#e87ba4']
export const SERIES_OTHER = '#9ca3af'

const compact = (n) =>
  n >= 1000 ? (n / 1000).toLocaleString('en-US', { maximumFractionDigits: n >= 100000 ? 0 : 1 }) + 'K' : String(n)

/* ---------------- Line chart (single-series trend) ---------------- */
export function LineChart({ data, height = 220 }) {
  const W = 560
  const H = height
  const PAD = { top: 14, right: 52, bottom: 26, left: 44 }
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)

  const { pts, ticks, yMin, yMax } = useMemo(() => {
    const values = data.map((d) => d.value)
    const lo = Math.min(...values)
    const hi = Math.max(...values)
    const span = hi - lo || 1
    const step = niceStep(span / 3)
    const yMin = Math.floor((lo - span * 0.08) / step) * step
    const yMax = Math.ceil((hi + span * 0.05) / step) * step
    const ticks = []
    for (let v = yMin; v <= yMax + 1e-6; v += step) ticks.push(v)
    const x = (i) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right)
    const y = (v) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom)
    return { pts: data.map((d, i) => ({ ...d, x: x(i), y: y(d.value) })), ticks, yMin, yMax }
  }, [data, H])

  const linePath = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - PAD.bottom} L${pts[0].x},${H - PAD.bottom} Z`
  const last = pts[pts.length - 1]

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    pts.forEach((p, i) => { if (Math.abs(p.x - px) < Math.abs(pts[best].x - px)) best = i })
    setHover(best)
  }

  const hp = hover != null ? pts[hover] : null

  return (
    <div className="viz-wrap" ref={wrapRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', display: 'block' }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Total balance trend by month"
      >
        {ticks.map((t) => {
          const y = PAD.top + (1 - (t - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom)
          return (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="var(--gridline)" strokeWidth="1" />
              <text x={PAD.left - 8} y={y + 3.5} textAnchor="end" fontSize="10.5" fill="var(--ink-muted)">
                {compact(convert(t))}
              </text>
            </g>
          )
        })}
        <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--axis)" strokeWidth="1" />
        {pts.map((p) => (
          <text key={p.label} x={p.x} y={H - PAD.bottom + 16} textAnchor="middle" fontSize="10.5" fill="var(--ink-muted)">
            {p.label}
          </text>
        ))}

        <path d={areaPath} fill="var(--series-1)" opacity="0.1" />
        <path d={linePath} fill="none" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* crosshair */}
        {hp && <line x1={hp.x} x2={hp.x} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--axis)" strokeWidth="1" />}
        {hp && <circle cx={hp.x} cy={hp.y} r="5" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />}

        {/* end marker + direct label on the endpoint only */}
        <circle cx={last.x} cy={last.y} r="4.5" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />
        <text x={last.x + 9} y={last.y + 3.5} fontSize="11" fontWeight="700" fill="var(--ink)">
          {compact(convert(last.value))}
        </text>
      </svg>
      {hp && (
        <div
          className="viz-tooltip"
          style={{ left: `${(hp.x / W) * 100}%`, top: `${(hp.y / H) * 100}%` }}
        >
          <div className="tt-label">{hp.label} 2026</div>
          <div className="tt-value">{fmtMoney(hp.value)}</div>
        </div>
      )}
    </div>
  )
}

function niceStep(raw) {
  const mag = 10 ** Math.floor(Math.log10(raw))
  const n = raw / mag
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * mag
}

/* ---------------- Donut chart (part-to-whole, categorical) ---------------- */
export function DonutChart({ data, centerLabel = 'Total', size = 176, maxSlices = 6, otherLabel = 'Other' }) {
  const [hover, setHover] = useState(null)

  const slices = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value)
    let items = sorted
    if (sorted.length > maxSlices) {
      const head = sorted.slice(0, maxSlices - 1)
      const rest = sorted.slice(maxSlices - 1).reduce((s, d) => s + d.value, 0)
      items = [...head, { label: otherLabel, value: rest, isOther: true }]
    }
    const total = items.reduce((s, d) => s + d.value, 0)
    let angle = -Math.PI / 2
    return items.map((d, i) => {
      const frac = d.value / total
      const start = angle
      angle += frac * Math.PI * 2
      return {
        ...d,
        color: d.isOther ? SERIES_OTHER : SERIES[i],
        frac, start, end: angle, total,
      }
    })
  }, [data, maxSlices, otherLabel])

  const total = slices.reduce((s, d) => s + d.value, 0)
  const R = size / 2
  const r = R - 26

  return (
    <div className="donut-layout">
      <div className="viz-wrap" style={{ width: size, flex: 'none' }}>
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, display: 'block' }} role="img" aria-label={centerLabel}>
          {slices.map((s, i) => (
            <path
              key={s.label}
              d={arcPath(R, R, R - 2, r, s.start, s.end)}
              fill={s.color}
              stroke="var(--surface)"
              strokeWidth="2"
              opacity={hover == null || hover === i ? 1 : 0.35}
              style={{ transition: 'opacity 0.12s' }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
          <text x={R} y={R - 4} textAnchor="middle" fontSize="10.5" fill="var(--ink-muted)">
            {hover != null ? slices[hover].label : centerLabel}
          </text>
          <text x={R} y={R + 14} textAnchor="middle" fontSize="14.5" fontWeight="700" fill="var(--ink)">
            {fmtMoney(hover != null ? slices[hover].value : total)}
          </text>
        </svg>
        {hover != null && (
          <div className="viz-tooltip" style={{ left: '50%', top: '6px' }}>
            <div className="tt-label">{slices[hover].label}</div>
            <div className="tt-value">
              {fmtMoney(slices[hover].value)} · {Math.round(slices[hover].frac * 100)}%
            </div>
          </div>
        )}
      </div>
      {/* value legend — identity + the relief channel for the light slots */}
      <div className="donut-legend">
        {slices.map((s, i) => (
          <div
            key={s.label}
            className="legend-row"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="legend-swatch" style={{ background: s.color }} />
            <span className="legend-label">{s.label}</span>
            <span className="legend-value">{fmtMoney(s.value)}</span>
            <span className="legend-pct">{Math.round(s.frac * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function arcPath(cx, cy, R, r, a0, a1) {
  // clamp: a full-circle single slice needs two arcs
  const full = a1 - a0 >= Math.PI * 2 - 1e-4
  if (full) a1 = a0 + Math.PI * 2 - 1e-4
  const large = a1 - a0 > Math.PI ? 1 : 0
  const p = (rad, a) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`
  return [
    `M${p(R, a0)}`,
    `A${R},${R} 0 ${large} 1 ${p(R, a1)}`,
    `L${p(r, a1)}`,
    `A${r},${r} 0 ${large} 0 ${p(r, a0)}`,
    'Z',
  ].join(' ')
}
