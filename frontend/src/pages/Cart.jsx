import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const fallbackImage =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'

export default function Cart() {
  const { items, increaseQty, decreaseQty, removeItem, subtotal, gst, deliveryCharge, grandTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#fff1e7] text-5xl shadow-soft">🛒</div>
        <h1 className="mt-6 text-3xl font-black tracking-[-0.05em] text-slate-900">Your cart is empty</h1>
        <p className="mt-3 text-sm text-slate-500">Add a few delicious items and come back here to checkout.</p>
        <Link to="/dashboard" className="mt-7 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500">
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Your order</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-5xl">Cart</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.cartId} className="flex flex-col gap-4 rounded-[26px] border border-[#f1e3d9] bg-white p-4 shadow-soft sm:flex-row sm:items-center">
              <img
                src={item.image || fallbackImage}
                alt={item.name}
                className="h-28 w-full rounded-[20px] object-cover sm:w-28"
              />

              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xl font-bold text-slate-900">{item.name}</p>
                    {item.details && (
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.details.sauce}, {item.details.cheese}
                        {item.details.vegetables?.length > 0 && `, ${item.details.vegetables.join(', ')}`}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-semibold text-brand-700">₹{item.unitPrice} each</p>
                  </div>

                  <button onClick={() => removeItem(item.cartId)} className="text-sm font-semibold text-red-500 transition hover:text-red-600">
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center overflow-hidden rounded-full border border-[#f0dfd4] bg-[#fff9f5]">
                    <button onClick={() => decreaseQty(item.cartId)} className="h-10 w-10 text-lg font-bold text-slate-700 transition hover:bg-[#f9e8db]">−</button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                    <button onClick={() => increaseQty(item.cartId)} className="h-10 w-10 text-lg font-bold text-slate-700 transition hover:bg-[#f9e8db]">+</button>
                  </div>

                  <p className="text-lg font-black text-slate-900">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[28px] border border-[#f3e5db] bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Order summary</h2>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-slate-900">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span className="font-semibold text-slate-900">₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#f2e7df] pt-4 text-base font-black text-slate-900">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} className="mt-8 w-full rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600">
            Proceed to Checkout
          </button>

          <Link to="/dashboard" className="mt-4 block text-center text-sm font-semibold text-brand-700">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
