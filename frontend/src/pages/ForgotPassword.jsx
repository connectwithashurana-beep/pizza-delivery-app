import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api.js'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/forgot-password/', data)
      toast.success(res.data.message)
    } catch (err) {
      const detail = err.response?.data?.detail
      const fieldError = err.response?.data?.email?.[0]
      toast.error(fieldError || detail || 'Unable to send the reset link.')
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Forgot Password</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">We'll email you a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <input type="email" autoComplete="email" {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })} placeholder="Email"
            className={`w-full rounded-lg border px-4 py-2.5 text-slate-800 outline-none focus:ring-2 ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-[#f0dfd6] focus:border-brand-500 focus:ring-brand-100'}`} />
          {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-brand-300 disabled:text-white">
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <Link to="/login" className="mt-5 text-center text-sm font-semibold text-brand-600 hover:text-brand-700">Back to login</Link>
    </div>
  )
}
