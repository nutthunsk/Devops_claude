import { useLayoutEffect, useState } from 'react'
import { AppProvider, useApp } from './store'
import Layout from './components/Layout'
import { PageSkeleton } from './components/ui'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import Savings from './pages/Savings'
import Community from './pages/Community'
import Settings from './pages/Settings'

function Shell() {
  const { user } = useApp()
  const [page, setPage] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Simulated module load — skeleton instead of a blank page (PRD §5).
  // Layout effect so the skeleton paints before the page ever flashes in.
  useLayoutEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [page, user])

  if (!user) return <Login />

  const nav = (id) => {
    if (id !== page) setPage(id)
    window.scrollTo({ top: 0 })
  }

  return (
    <Layout page={page} onNav={nav}>
      {loading ? (
        <PageSkeleton />
      ) : page === 'dashboard' ? (
        <Dashboard onNav={nav} />
      ) : page === 'accounts' ? (
        <Accounts />
      ) : page === 'income' ? (
        <Transactions type="income" key="income" />
      ) : page === 'expense' ? (
        <Transactions type="expense" key="expense" />
      ) : page === 'savings' ? (
        <Savings />
      ) : page === 'community' ? (
        <Community />
      ) : (
        <Settings />
      )}
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
