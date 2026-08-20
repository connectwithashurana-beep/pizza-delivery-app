import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import api from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/analytics/').then((res) => setData(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!data) return <p className="p-10">Failed to load analytics.</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Analytics</h1>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="font-bold">Revenue - Last 30 Days</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly_orders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="font-bold">Best Selling Pizzas</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.best_selling_pizzas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pizza__name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sold" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="font-bold">Top Customers</h2>
          <ul className="mt-4 space-y-3">
            {data.top_customers.map((c, i) => (
              <li key={i} className="flex justify-between border-b pb-2 text-sm dark:border-gray-700">
                <span>{c.user__username} ({c.user__email})</span>
                <span className="font-bold text-primary-600">₹{c.total_spent} · {c.order_count} orders</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
