import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const foodImages = {
  pizza:
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
  burger:
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  fries:
    'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
  drink:
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
  dessert:
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
  shake:
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
}

function EyeIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      {open ? (
        <>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
          <path d="M9.1 5.3A11.4 11.4 0 0 1 12 5c6.5 0 10 7 10 7a16.4 16.4 0 0 1-4.2 5.6" />
          <path d="M6.7 6.7A16.7 16.7 0 0 0 2 12s3.5 7 10 7a11.6 11.6 0 0 0 5.3-1.3" />
        </>
      )}
    </svg>
  )
}

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      await registerUser(data)

      toast.success(
        'Registered! Please check your email to verify your account.'
      )

      navigate('/login')
    } catch (err) {
      const detail = err.response?.data

      let message = 'Registration failed.'

      if (detail?.detail) {
        message = detail.detail
      } else if (detail?.message) {
        message = detail.message
      } else if (detail?.non_field_errors?.length) {
        message = detail.non_field_errors[0]
      } else if (typeof detail === 'object' && detail !== null) {
        message = Object.entries(detail)
          .map(([field, messages]) => {
            const text = Array.isArray(messages)
              ? messages.join(' ')
              : String(messages)

            return `${field}: ${text}`
          })
          .join(' ')
      } else if (typeof detail === 'string') {
        message = detail
      }

      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf6]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_30px_80px_rgba(72,32,0,0.12)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden bg-[#1d130f] p-6 sm:p-8 lg:p-10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.22),transparent_35%)]" />
              </div>

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">🍕</span>
                    <span>
                      Pizza<span className="text-orange-400">Hub</span>
                    </span>
                  </Link>

                  <Link
                    to="/"
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    Back to Home
                  </Link>
                </div>

                <div className="pt-8 sm:pt-10">
                  <span className="inline-flex items-center rounded-full border border-orange-300/25 bg-orange-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200">
                    Fresh • Fast • Flavorful
                  </span>

                  <h1 className="mt-5 max-w-md text-4xl font-black leading-tight text-white sm:text-5xl lg:text-[3.2rem]">
                    Everything you love, <span className="text-orange-400">delivered.</span>
                  </h1>

                  <p className="mt-4 max-w-md text-base leading-7 text-white/75">
                    Pizza, burgers, sides, drinks and desserts — all in one place.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
                  <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/10 backdrop-blur-sm">
                    <img src={foodImages.pizza} alt="Pizza" className="h-28 w-full rounded-[20px] object-cover" />
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Pizza</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-orange-200">Best Seller</p>
                      </div>
                      <span className="rounded-full bg-orange-500/20 px-2 py-1 text-[10px] font-semibold text-orange-100">Fresh</span>
                    </div>
                  </div>

                  <div className="relative mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/10 backdrop-blur-sm">
                    <img src={foodImages.burger} alt="Burger" className="h-28 w-full rounded-[20px] object-cover" />
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Burger</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-orange-200">Popular</p>
                      </div>
                      <span className="rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-semibold text-red-100">Hot</span>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/10 backdrop-blur-sm">
                    <img src={foodImages.fries} alt="French fries" className="h-28 w-full rounded-[20px] object-cover" />
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Fries</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-orange-200">Crispy</p>
                      </div>
                      <span className="rounded-full bg-yellow-400/20 px-2 py-1 text-[10px] font-semibold text-yellow-100">Hot</span>
                    </div>
                  </div>

                  <div className="relative mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/10 backdrop-blur-sm">
                    <img src={foodImages.drink} alt="Cold drink" className="h-28 w-full rounded-[20px] object-cover" />
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">Drinks</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-orange-200">Chilled</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-semibold text-cyan-100">Cold</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <img src={foodImages.dessert} alt="Dessert" className="h-20 w-full rounded-xl object-cover" />
                    <p className="mt-2 text-xs font-semibold text-white">Dessert</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <img src={foodImages.shake} alt="Milkshake" className="h-20 w-full rounded-xl object-cover" />
                    <p className="mt-2 text-xs font-semibold text-white">Shake</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <img src={foodImages.pizza} alt="Pizza slice" className="h-20 w-full rounded-xl object-cover" />
                    <p className="mt-2 text-xs font-semibold text-white">Fast</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex-1 bg-[#fffaf3] p-6 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-xl">
                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl shadow-sm">
                    👋
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-[2.1rem]">
                    Create your account
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Join PizzaHub and get your favorite food delivered faster.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-orange-500">✉️</span>
                      <input
                        type="email"
                        autoComplete="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="you@example.com"
                        className={`w-full rounded-2xl border bg-[#fffaf6] py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          errors.email
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-orange-500">📱</span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        {...register('phone')}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-gray-200 bg-[#fffaf6] py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-base text-orange-500">📍</span>
                      <textarea
                        {...register('address')}
                        placeholder="Enter your delivery address"
                        rows={3}
                        className="w-full resize-none rounded-2xl border border-gray-200 bg-[#fffaf6] py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-orange-500">🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                        })}
                        placeholder="Minimum 8 characters"
                        className={`w-full rounded-2xl border bg-[#fffaf6] py-3.5 pl-12 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          errors.password
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-orange-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-orange-500">🔐</span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('confirmPassword', {
                          required: 'Confirm password is required',
                          validate: (value) => value === watch('password') || 'Passwords do not match',
                        })}
                        placeholder="Re-enter your password"
                        className={`w-full rounded-2xl border bg-[#fffaf6] py-3.5 pl-12 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:bg-white ${
                          errors.confirmPassword
                            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-orange-600"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        <EyeIcon open={showConfirmPassword} />
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-700">
                      Why choose PizzaHub
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                      <div className="flex items-center gap-2"><span>⚡</span><span>Fast Delivery</span></div>
                      <div className="flex items-center gap-2"><span>📦</span><span>Easy Tracking</span></div>
                      <div className="flex items-center gap-2"><span>❤️</span><span>Save Favorites</span></div>
                      <div className="flex items-center gap-2"><span>🎁</span><span>Exclusive Offers</span></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 px-5 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Creating your account...' : 'Create Account 🍕'}
                    </span>
                  </button>
                </form>

                <div className="mt-7 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-orange-600 transition hover:text-red-600">
                      Login
                    </Link>
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 border-t border-gray-200 pt-5 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>Your information is securely protected.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}