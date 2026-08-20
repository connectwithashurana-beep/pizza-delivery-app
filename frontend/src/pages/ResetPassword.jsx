import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api.js'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/reset-password/', { token, new_password: data.password })
      toast.success('Password reset successfully! Please login.')
      navigate('/login')
    } catch {
      toast.error('Invalid or expired reset link.')
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-extrabold">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input type="password" {...register('password', { required: true, minLength: 8 })} placeholder="New Password"
          className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
        <button type="submit" disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
