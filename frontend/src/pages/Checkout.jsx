import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Checkout() {
  const { items, subtotal, gst, deliveryCharge, grandTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { delivery_address: user?.address || '', contact_number: user?.phone || '' },
  })

  const onSubmit = async (data) => {
    try {
      const payload = {
        delivery_address: data.delivery_address,
        contact_number: data.contact_number,
        payment_method: paymentMethod,
        items: items.map((i) => ({
          pizza_id: i.pizzaId || null,
          base_id: i.baseId || null,
          sauce_id: i.sauceId || null,
          cheese_id: i.cheeseId || null,
          vegetable_ids: i.vegetableIds || [],
          quantity: i.quantity,
        })),
      }
      const res = await api.post('/orders/', payload)
      if (paymentMethod === 'Razorpay') {
        toast.success('Order created. Proceed to payment.')
        navigate(`/payment/${res.data.id}`)
      } else {
        clearCart()
        toast.success('Order placed successfully!')
        navigate(`/orders/${res.data.id}`)
      }
    } catch (err) {
      const detail = err.response?.data?.detail
      const walletError = err.response?.data?.payment_method
      const message = typeof detail === 'string'
        ? detail
        : Array.isArray(walletError)
          ? walletError[0]
          : 'Failed to place order. Ensure all custom items have base/sauce/cheese selected.'
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Checkout</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl">Complete your order</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#f1e4dc] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-900">Delivery address</h2>
            <div className="mt-5 space-y-4">
              <div>
                <textarea
                  {...register('delivery_address', { required: 'Address is required' })}
                  placeholder="Street, area, landmark..."
                  rows={4}
                  className="w-full rounded-2xl border border-[#f0dfd4] bg-[#fffaf6] px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                />
                {errors.delivery_address && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.delivery_address.message}</p>}
              </div>
              <div>
                <input
                  {...register('contact_number', { required: 'Contact number is required' })}
                  placeholder="Contact number"
                  className="w-full rounded-2xl border border-[#f0dfd4] bg-[#fffaf6] px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                />
                {errors.contact_number && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.contact_number.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#f1e4dc] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-900">Payment method</h2>
            <div className="mt-5 space-y-3">
              {['Cash on delivery', 'Razorpay', 'Wallet'].map((method, idx) => {
                const value = idx === 0 ? 'COD' : method
                return (
                <label key={method} className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#f1e4dc] bg-[#fffaf6] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="sr-only"
                    />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] text-brand-700">
                      {paymentMethod === value ? '●' : ''}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{method}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{idx === 1 ? 'Popular' : 'Standard'}</span>
                </label>
                )
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#f1e4dc] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black tracking-[-0.04em] text-slate-900">Coupon code</h2>
            <div className="mt-5 flex gap-3">
              <input
                type="text"
                placeholder="PIZZA20"
                className="flex-1 rounded-2xl border border-[#f0dfd4] bg-[#fffaf6] px-4 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
              <button type="button" className="rounded-2xl bg-[#fff1e7] px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-[#fee8d9]">
                Apply
              </button>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[28px] border border-[#f1e4dc] bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black tracking-[-0.04em] text-slate-900">Order summary</h2>

          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="font-semibold text-slate-900">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-[#f2e7df] pt-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span className="font-semibold text-slate-900">₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GST</span>
              <span className="font-semibold text-slate-900">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 text-base font-black text-slate-900">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-8 w-full rounded-full bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Placing order...' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  )
}
