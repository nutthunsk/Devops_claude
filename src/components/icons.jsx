// Shared stroke-icon set (24×24 grid, currentColor) — same style as the nav
// icons in Layout.jsx. Replaces the emoji used across the app.
const PATHS = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />,
  utensils: <><path d="M5 3v5a3 3 0 0 0 6 0V3" /><path d="M8 3v18" /><path d="M19 21V3c-2.5 1-4 3.5-4 7v2h4" /></>,
  car: <><path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.5h7.4a2 2 0 0 1 1.9 1.3L19 11" /><rect x="3" y="11" width="18" height="6" rx="2" /><path d="M6 17v2M18 17v2M7 14h.01M17 14h.01" /></>,
  'shopping-bag': <><path d="M6 7h12l1 13a1.5 1.5 0 0 1-1.5 1.6h-11A1.5 1.5 0 0 1 5 20z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
  'trending-up': <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  heart: <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6z" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M2 19h20" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  landmark: <><path d="M3 21h18M4 18h16M6 18v-8M10 18v-8M14 18v-8M18 18v-8" /><path d="m12 3 9 5H3z" /></>,
  percent: <><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></>,
  box: <><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  banknote: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></>,
  'credit-card': <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  smartphone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  wallet: <><path d="M17 9V6.5A1.5 1.5 0 0 0 15.5 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10.5a1.5 1.5 0 0 0 1.5-1.5V15" /><path d="M21 9.5a1 1 0 0 0-1-1h-4a3 3 0 0 0 0 6h4a1 1 0 0 0 1-1z" /><path d="M16.5 11.5v.01" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" /></>,
  'message-circle': <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z" />,
  'arrow-up': <path d="M12 19V5M5 12l7-7 7 7" />,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
}

export function Icon({ name, size = 16, strokeWidth = 1.8, style }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={style}
    >
      {PATHS[name] || PATHS.box}
    </svg>
  )
}

const CATEGORY_ICON = {
  Housing: 'home', 'Food & Drink': 'utensils', Transport: 'car', Shopping: 'shopping-bag',
  'Bills & Utilities': 'zap', Entertainment: 'film', Investment: 'trending-up', Health: 'heart',
  Salary: 'briefcase', Freelance: 'laptop', 'Side Hustle': 'wrench', Dividends: 'landmark',
  Interest: 'percent', Gift: 'gift', Other: 'box',
}

export function CategoryIcon({ category, size = 16 }) {
  return <Icon name={CATEGORY_ICON[category] || 'box'} size={size} />
}

const ACCOUNT_TYPE_ICON = {
  'Bank Account': 'landmark', Cash: 'banknote', 'Credit Card': 'credit-card',
  'E-Wallet': 'smartphone', Investment: 'trending-up',
}

export function AccountTypeIcon({ type, size = 18 }) {
  return <Icon name={ACCOUNT_TYPE_ICON[type] || 'wallet'} size={size} />
}
