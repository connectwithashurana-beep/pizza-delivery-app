import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

const heroImage =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'

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

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, false)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed.')
    }
  }

  return (
    <div className="min-h-[82vh] bg-[#fffaf5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-[#f3e5dc] bg-white shadow-[0_30px_80px_rgba(30,18,12,0.08)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-[#1e1714] lg:block">
            <img src={heroImage} alt="Food platter" className="h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,177,122,0.45),transparent_35%),linear-gradient(135deg,rgba(30,23,20,0.2),rgba(30,23,20,0.8))]" />

            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">🍕</span>
                  <span className="text-xl font-black">PizzaHub</span>
                </div>
              </div>

              <div className="max-w-md">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f9d7bb]">
                  Freshly made
                </span>
                <h1 className="mt-5 text-4xl font-black leading-tight text-white">Your favorite food, just a tap away.</h1>
                <p className="mt-4 text-base leading-7 text-slate-200">Open your menu, choose your cravings, and get it delivered hot and fresh.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-white">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                  <div className="text-xl font-black">20+</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Menu items</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                  <div className="text-xl font-black">30m</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Delivery</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                  <div className="text-xl font-black">4.9</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fffaf6] p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e7] text-2xl shadow-sm">🍽️</div>
                <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-[2.1rem]">Welcome back!</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Your favorite food is waiting for you.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-brand-600">✉️</span>
                    <input
                      type="email"
                      autoComplete="email"
                      {...register('email', { required: 'Email is required' })}
                      placeholder="you@example.com"
                      className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#f0dfd6] focus:border-brand-500 focus:ring-brand-100'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-brand-600">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password', { required: 'Password is required' })}
                      placeholder="Enter your password"
                      className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.password
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#f0dfd6] focus:border-brand-500 focus:ring-brand-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-brand-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <input type="checkbox" className="rounded border-[#e8d9cf] text-brand-600 focus:ring-brand-500" />
                    <span>Remember me</span>
                  </div>
                  <Link to="/forgot-password" className="font-semibold text-brand-600 transition hover:text-brand-700">Forgot Password?</Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="mt-7 text-center">
                <p className="text-sm text-slate-500">
                  New to PizzaHub?{' '}
                  <Link to="/register" className="font-bold text-brand-600 transition hover:text-brand-700">Create Account</Link>
                </p>
              </div>

              <div className="mt-7 flex items-center justify-center gap-3 border-t border-[#f2e6df] pt-5 text-xs text-slate-500">
                <span>🔒 Secure</span>
                <span>•</span>
                <span>⚡ Fast</span>
                <span>•</span>
                <span>🍕 Delicious</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
