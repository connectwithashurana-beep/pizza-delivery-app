import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, true)
      toast.success('Welcome, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid admin credentials.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 p-8 text-white">
        <h1 className="text-2xl font-extrabold">🍕 Admin Login</h1>
        <p className="mt-1 text-sm text-gray-400">Restricted access for administrators only.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input {...register('email', { required: 'Email is required' })} placeholder="Admin Email"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5" />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <input type="password" {...register('password', { required: 'Password is required' })} placeholder="Password"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5" />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-600 py-2.5 font-semibold hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
