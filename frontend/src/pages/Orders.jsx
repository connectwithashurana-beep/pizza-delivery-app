import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import Spinner from '../components/Spinner.jsx'

const statusColors = {
  received: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  in_kitchen: 'bg-orange-100 text-orange-700',
  ready: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const fallbackImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/orders/')
      .then((res) => setOrders(res.data.results || res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Orders</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#ecd8ca] bg-white p-12 text-center shadow-soft">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff2e8] text-3xl">📦</div>
          <p className="mt-4 text-lg font-semibold text-slate-800">You haven't placed any orders yet.</p>
          <Link to="/dashboard" className="mt-5 inline-flex rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500">
            Order your favorites
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} to={`/orders/${o.id}`} className="block overflow-hidden rounded-[28px] border border-[#f1e4dc] bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-hover sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={o.items?.[0]?.image || fallbackImage} alt="Order item" className="h-24 w-full rounded-[20px] object-cover sm:w-28" />

                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-black text-slate-900">Order #{o.id}</p>
                      <p className="text-sm text-slate-500">{new Date(o.created_at).toLocaleString()}</p>
                    </div>

                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] ${statusColors[o.status] || 'bg-slate-100 text-slate-700'}`}>
                      {String(o.status || 'received').replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-600">
                    <span>{o.items?.length || 0} item(s)</span>
                    <span className="text-lg font-black text-slate-900">₹{o.grand_total}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
