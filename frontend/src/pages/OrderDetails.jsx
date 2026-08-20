import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import Spinner from '../components/Spinner.jsx'

const statusSteps = ['received', 'preparing', 'in_kitchen', 'ready', 'out_for_delivery', 'delivered']
const statusLabels = {
  received: 'Order Received',
  preparing: 'Preparing',
  in_kitchen: 'In Kitchen',
  ready: 'Ready',
  out_for_delivery: 'Out For Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusEmojis = {
  received: '📦',
  preparing: '👨‍🍳',
  in_kitchen: '🔥',
  ready: '✅',
  out_for_delivery: '🚗',
  delivered: '🎉',
  cancelled: '❌',
}

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const wsRef = useRef(null)

  const fetchOrder = () => {
    api
      .get(`/orders/${id}/`)
      .then((res) => {
        setOrder(res.data)
        if (res.data.rating) setHasRated(true)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrder()
    const wsBase = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000/ws'
    const token = localStorage.getItem('access_token')
    const ws = new WebSocket(`${wsBase}/orders/${id}/?token=${encodeURIComponent(token || '')}`)
    wsRef.current = ws
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setOrder((prev) => (prev ? { ...prev, status: data.status } : prev))
    }
    return () => ws.close()
  }, [id])

  const handleRateOrder = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitLoading(true)
    try {
      await api.post(`/orders/${id}/rate/`, {
        rating,
        review_text: reviewText,
      })
      toast.success('Thank you for your feedback!')
      setHasRated(true)
      fetchOrder()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit rating')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf5]">
        <Spinner />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf5]">
        <p className="text-center text-slate-600">Order not found.</p>
      </div>
    )
  }

  const currentIndex = statusSteps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-[#fffaf5] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900">Order #{order.id}</h1>
          <p className="mt-2 text-slate-500">
            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
          </p>
          <p className={`mt-1 text-sm font-semibold ${order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
            {statusEmojis[order.status]} {statusLabels[order.status] || order.status}
          </p>
        </div>

        {/* Timeline */}
        {order.status !== 'cancelled' && (
          <div className="mb-10 rounded-[20px] border border-[#f1e4dc] bg-white p-8 shadow-soft">
            <h2 className="mb-6 text-xl font-bold text-slate-900">Order Status</h2>
            <div className="flex items-center gap-2">
              {statusSteps.map((s, i) => (
                <div key={s} className="flex flex-1 flex-col items-center">
                  <div className="mb-2 flex items-center gap-2 w-full">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
                        i <= currentIndex
                          ? 'bg-brand-600 text-white shadow-lg'
                          : 'bg-[#f1e4dc] text-slate-400'
                      }`}
                    >
                      {statusEmojis[s]}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div
                        className={`h-1 flex-1 ${
                          i < currentIndex ? 'bg-brand-600' : 'bg-[#f1e4dc]'
                        }`}
                      />
                    )}
                  </div>
                  <p className="mt-1 text-center text-xs font-semibold text-slate-700">{statusLabels[s]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status === 'cancelled' && (
          <div className="mb-10 rounded-[20px] border border-red-200 bg-red-50 p-8">
            <p className="text-center text-lg font-bold text-red-700">❌ This order has been cancelled</p>
          </div>
        )}

        {/* Items */}
        <div className="mb-8 rounded-[20px] border border-[#f1e4dc] bg-white p-8 shadow-soft">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Order Items</h2>
          <div className="space-y-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-[#f1e4dc] pb-5 last:border-0">
                <div>
                  <p className="font-semibold text-slate-900">{item.pizza_name || 'Custom Item'}</p>
                  <p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p>
                  {[item.base_name, item.sauce_name, item.cheese_name].some(Boolean) && (
                    <p className="mt-1 text-xs text-slate-500">
                      {[item.base_name, item.sauce_name, item.cheese_name].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {item.vegetable_names.length > 0 && (
                    <p className="mt-1 text-xs text-slate-500">Veggies: {item.vegetable_names.join(', ')}</p>
                  )}
                </div>
                <p className="font-bold text-slate-900">₹{Math.round(item.total_price)}</p>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-6 space-y-3 border-t border-[#f1e4dc] pt-6">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{Math.round(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (18%)</span>
              <span>₹{Math.round(order.gst)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge</span>
              <span>₹{Math.round(order.delivery_charge)}</span>
            </div>
            <div className="flex justify-between border-t border-[#f1e4dc] pt-3 text-xl font-bold text-slate-900">
              <span>Total</span>
              <span>₹{Math.round(order.grand_total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="mb-8 rounded-[20px] border border-[#f1e4dc] bg-white p-8 shadow-soft">
          <h2 className="mb-4 text-xl font-bold text-slate-900">📍 Delivery Address</h2>
          <p className="whitespace-pre-wrap text-slate-700">{order.delivery_address}</p>
          <p className="mt-4 text-slate-600">📞 {order.contact_number}</p>
        </div>

        {/* Rating Section */}
        {order.status === 'delivered' && !hasRated && (
          <div className="mb-8 rounded-[20px] border border-[#f1e4dc] bg-white p-8 shadow-soft">
            <h2 className="mb-6 text-xl font-bold text-slate-900">⭐ Rate Your Order</h2>
            <form onSubmit={handleRateOrder}>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-slate-700">How was your experience?</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition ${
                        rating >= value
                          ? 'bg-yellow-100 text-yellow-500 shadow-lg'
                          : 'bg-[#f1e4dc] text-slate-400 hover:bg-[#e7d2c4]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-slate-700">Add a comment (optional)</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your feedback about this order..."
                  className="w-full rounded-2xl border border-[#f1e4dc] bg-[#f7f3ef] px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading || rating === 0}
                className="w-full rounded-full bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {(hasRated || order.status !== 'delivered') && order.status === 'delivered' && (
          <div className="rounded-[20px] border border-green-200 bg-green-50 p-8">
            <p className="text-center font-semibold text-green-700">✅ Thank you for rating this order!</p>
          </div>
        )}
      </div>
    </div>
  )
}
