import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api.js'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/reset-password/', { token, new_password: data.password })
      toast.success('Password reset successfully! Please login.')
      navigate('/login')
    } catch (error) {
      const detail = error.response?.data
      const message = detail?.new_password?.[0] || detail?.detail || 'Invalid or expired reset link.'
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input type="password" autoComplete="new-password" {...register('password', {
          required: 'New password is required',
          minLength: { value: 8, message: 'Use at least 8 characters.' },
        })} placeholder="New Password"
          className="w-full rounded-lg border border-[#f0dfd6] px-4 py-2.5 text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        <input type="password" autoComplete="new-password" {...register('confirm_password', {
          required: 'Please confirm your password.',
          validate: (value, values) => value === values.password || 'Passwords do not match',
        })} placeholder="Confirm New Password"
          className="w-full rounded-lg border border-[#f0dfd6] px-4 py-2.5 text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        {errors.confirm_password && <p className="text-sm text-red-500">{errors.confirm_password.message || 'Please confirm your password.'}</p>}
        <button type="submit" disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-brand-300 disabled:text-white">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <Link to="/login" className="mt-5 block text-center text-sm font-semibold text-brand-600 hover:text-brand-700">Back to login</Link>
    </div>
  )
}
