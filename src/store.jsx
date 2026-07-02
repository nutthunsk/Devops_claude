import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  MOCK_USER, MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_GOALS, MOCK_POSTS,
} from './data/mock'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const THEMES = ['light', 'dark', 'system']
const systemPrefersDark = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const resolveTheme = (t) => (t === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : t)

export const CURRENCIES = {
  THB: { symbol: '฿', label: 'Thai Baht' },
  USD: { symbol: '$', label: 'US Dollar' },
  EUR: { symbol: '€', label: 'Euro' },
  GBP: { symbol: '£', label: 'British Pound' },
  JPY: { symbol: '¥', label: 'Japanese Yen' },
}
// Module-level symbol kept in sync by AppProvider so every existing
// fmtMoney(x) call reflects the chosen currency without a prop drill.
let CURRENCY_SYMBOL = CURRENCIES[localStorage.getItem('ws-currency')]?.symbol || '฿'

export const fmtMoney = (n, decimals = 0) =>
  CURRENCY_SYMBOL + Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

export const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const todayISO = () => new Date().toISOString().slice(0, 10)

const CAT_EMOJI = {
  Housing: '🏠', 'Food & Drink': '🍜', Transport: '🚇', Shopping: '🛍️',
  'Bills & Utilities': '💡', Entertainment: '🎬', Investment: '📈', Health: '💊',
  Salary: '💼', Freelance: '🧑‍💻', 'Side Hustle': '🔧', Dividends: '🏦',
  Interest: '🪙', Gift: '🎁', Other: '📦',
}
export const catEmoji = (c) => CAT_EMOJI[c] || '📦'

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS)
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [goals, setGoals] = useState(MOCK_GOALS)
  const [posts, setPosts] = useState(MOCK_POSTS.map((p) => ({ ...p, voted: false })))

  // Settings
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('ws-theme')
    return THEMES.includes(saved) ? saved : 'light'
  })
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('ws-currency') || 'THB')

  // Apply the resolved theme to <html> so CSS variables swap app-wide,
  // and follow the OS setting live while in "system" mode.
  useEffect(() => {
    const apply = () => document.documentElement.setAttribute('data-theme', resolveTheme(theme))
    apply()
    localStorage.setItem('ws-theme', theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const setTheme = (t) => setThemeState(THEMES.includes(t) ? t : 'light')
  const setCurrency = (c) => {
    if (!CURRENCIES[c]) return
    CURRENCY_SYMBOL = CURRENCIES[c].symbol
    setCurrencyState(c)
    localStorage.setItem('ws-currency', c)
  }

  const login = (email) => {
    setUser({ ...MOCK_USER, email })
  }
  const logout = () => setUser(null)

  const updateProfile = (patch) => setUser((u) => ({ ...u, ...patch }))

  const resetData = () => {
    setAccounts(MOCK_ACCOUNTS)
    setTransactions(MOCK_TRANSACTIONS)
    setGoals(MOCK_GOALS)
    setPosts(MOCK_POSTS.map((p) => ({ ...p, voted: false })))
  }

  const addTransaction = (tx) => {
    const item = { ...tx, id: 'tx_' + Math.random().toString(36).slice(2, 8) }
    setTransactions((prev) => [item, ...prev])
    setAccounts((prev) =>
      prev.map((a) =>
        a.name === tx.account
          ? { ...a, balance: a.balance + (tx.type === 'income' ? tx.amount : -tx.amount) }
          : a,
      ),
    )
  }

  const addAccount = (acc) =>
    setAccounts((prev) => [...prev, { ...acc, id: 'acc_' + Math.random().toString(36).slice(2, 8) }])

  const deleteAccount = (id) => setAccounts((prev) => prev.filter((a) => a.id !== id))

  const addGoal = (goal) =>
    setGoals((prev) => [...prev, { ...goal, id: 'goal_' + Math.random().toString(36).slice(2, 8) }])

  const deleteGoal = (id) => setGoals((prev) => prev.filter((g) => g.id !== id))

  const toggleVote = (postId) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.post_id === postId
          ? { ...p, voted: !p.voted, upvotes: p.upvotes + (p.voted ? -1 : 1) }
          : p,
      ),
    )

  const addPost = ({ title, content, tag }) =>
    setPosts((prev) => [
      {
        post_id: 'post_' + Math.random().toString(36).slice(2, 8),
        author: { name: user?.name || 'You', avatar: user?.avatar },
        title, content, tag: tag || 'General',
        upvotes: 1, comments_count: 0, created_at: 'Just now', voted: true, mine: true,
      },
      ...prev,
    ])

  // Derived: dashboard summary (PRD mock overview shape, computed live so
  // newly added transactions re-render the dashboard instantly)
  const summary = useMemo(() => {
    const month = todayISO().slice(0, 7)
    const inMonth = transactions.filter((t) => t.date.startsWith(month))
    return {
      total_balance: accounts.reduce((s, a) => s + a.balance, 0),
      total_income_this_month: inMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      total_expense_this_month: inMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      total_savings_this_month: 12000,
    }
  }, [accounts, transactions])

  const value = {
    user, login, logout, updateProfile,
    accounts, addAccount, deleteAccount,
    transactions, addTransaction,
    goals, addGoal, deleteGoal,
    posts, toggleVote, addPost,
    summary,
    theme, setTheme, currency, setCurrency, resetData,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
