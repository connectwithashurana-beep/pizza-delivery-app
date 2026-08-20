import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'

const allStatuses = ['received', 'preparing', 'in_kitchen', 'ready', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    api.get('/orders/', { params: { search, status: statusFilter || undefined } })
      .then((res) => setOrders(res.data.results || res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [search, statusFilter])

  const updateStatus = async (id, status) => {
    try {
      await api.post(`/orders/${id}/update_status/`, { status })
      toast.success('Order status updated!')
      fetchOrders()
    } catch {
      toast.error('Failed to update status.')
    }
  }

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await api.post(`/orders/${id}/cancel/`)
      toast.success('Order cancelled.')
      fetchOrders()
    } catch {
      toast.error('Failed to cancel order.')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Order Management</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by address or phone..."
          className="flex-1 rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-2.5 dark:bg-gray-800">
          <option value="">All Statuses</option>
          {allStatuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl bg-white p-5 shadow dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Order #{o.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{o.delivery_address} · {o.contact_number}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary-600">₹{o.grand_total}</span>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="rounded-lg border px-3 py-1.5 text-sm dark:bg-gray-900">
                    {allStatuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                  {o.status !== 'cancelled' && o.status !== 'delivered' && (
                    <button onClick={() => cancelOrder(o.id)} className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
