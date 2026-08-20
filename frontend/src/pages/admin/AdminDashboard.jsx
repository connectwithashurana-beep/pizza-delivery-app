import { useEffect, useState } from 'react'
import api from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'

const cardStyles = [
  { key: 'total_revenue', label: 'Total Revenue', prefix: '₹', color: 'bg-green-500' },
  { key: 'today_revenue', label: "Today's Revenue", prefix: '₹', color: 'bg-emerald-500' },
  { key: 'total_orders', label: 'Total Orders', prefix: '', color: 'bg-blue-500' },
  { key: 'pending_orders', label: 'Pending Orders', prefix: '', color: 'bg-yellow-500' },
  { key: 'completed_orders', label: 'Completed Orders', prefix: '', color: 'bg-indigo-500' },
  { key: 'cancelled_orders', label: 'Cancelled Orders', prefix: '', color: 'bg-red-500' },
]

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/summary/').then((res) => setSummary(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!summary) return <p className="p-10">Failed to load dashboard.</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cardStyles.map((c) => (
          <div key={c.key} className="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
            <div className={`h-2 w-12 rounded-full ${c.color}`} />
            <p className="mt-4 text-3xl font-extrabold">{c.prefix}{summary[c.key]}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="font-bold text-red-600">⚠️ Low Stock Alerts</h2>
        {summary.low_stock_alerts.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">All inventory levels are healthy.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {summary.low_stock_alerts.map((item, i) => (
              <li key={i} className="flex justify-between rounded-lg bg-red-50 px-4 py-2 text-sm dark:bg-red-900/20">
                <span>{item.type.toUpperCase()}: {item.name}</span>
                <span className="font-bold text-red-600">{item.quantity} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
