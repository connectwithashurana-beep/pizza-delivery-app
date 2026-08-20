import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../services/api.js'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/forgot-password/', data)
      toast.success(res.data.message)
    } catch {
      toast.error('Something went wrong.')
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-extrabold">Forgot Password</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">We'll email you a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <input {...register('email', { required: true })} placeholder="Email"
          className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
        <button type="submit" disabled={isSubmitting}
          className="w-full rounded-lg bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}
