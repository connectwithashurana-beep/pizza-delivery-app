import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [processing, setProcessing] = useState(false)
  const handlePay = async () => {
    setProcessing(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Failed to load payment gateway.')
      }

      const { data } = await api.post('/payments/create-order/', { order_id: orderId })

      if (!data?.key || !data?.razorpay_order_id || !data?.amount) {
        throw new Error('Razorpay order response was incomplete.')
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'PizzaHub',
        description: `Order #${orderId}`,
        order_id: data.razorpay_order_id,
        handler: async (response) => {
          try {
            await api.post('/payments/verify/', response)
            clearCart()
            toast.success('Payment successful!')
            navigate(`/orders/${orderId}`)
          } catch (verifyError) {
            const verifyDetail = verifyError.response?.data
            const verifyMessage =
              verifyDetail?.detail ||
              verifyDetail?.message ||
              'Payment verification failed.'
            toast.error(verifyMessage)
          }
        },
        theme: { color: '#ea580c' },
        modal: { ondismiss: () => setProcessing(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setProcessing(false)
        const failureMessage = response?.error?.description || 'Payment failed. Please try again.'
        toast.error(failureMessage)
      })
      rzp.open()
    } catch (error) {
      const detail = error.response?.data
      const message =
        detail?.detail ||
        detail?.message ||
        error.message ||
        'Could not initiate payment.'
      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl">💳</div>
      <h1 className="mt-4 text-2xl font-bold">Complete Your Payment</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Order #{orderId}</p>
     <button
       onClick={handlePay}
       disabled={processing}
      className="mt-8 w-full rounded-xl bg-[#b04b20] px-6 py-3.5 font-semibold text-white shadow-[0_6px_20px_rgba(176,75,32,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#963d18] hover:shadow-[0_8px_24px_rgba(176,75,32,0.35)] disabled:cursor-not-allowed disabled:opacity-50"

  > 
       {processing ? 'Processing...' : 'Pay Now with Razorpay'}
     </button>
    </div>
  )
}
