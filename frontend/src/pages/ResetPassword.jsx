import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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
      <h1 className="text-3xl font-extrabold">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input type="password" {...register('password', { required: true, minLength: 8 })} placeholder="New Password"
          className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
        <input type="password" {...register('confirm_password', { required: true, validate: (value, values) => value === values.password || 'Passwords do not match' })} placeholder="Confirm New Password"
          className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
        {errors.password && <p className="text-sm text-red-500">Use at least 8 characters.</p>}
        {errors.confirm_password && <p className="text-sm text-red-500">{errors.confirm_password.message || 'Please confirm your password.'}</p>}
        <button type="submit" disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
