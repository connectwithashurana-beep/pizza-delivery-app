import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'

export default function AdminSettings() {
  const { user, fetchProfile } = useAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { username: user?.username, phone: user?.phone },
  })

  const onSubmit = async (data) => {
    try {
      await api.patch('/auth/profile/', data)
      await fetchProfile()
      toast.success('Settings updated!')
    } catch {
      toast.error('Failed to update settings.')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-md space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="font-bold">Admin Profile</h2>
        <input value={user?.email} disabled className="w-full rounded-lg border bg-gray-100 px-4 py-2.5 dark:bg-gray-900" />
        <input {...register('username')} placeholder="Username" className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <input {...register('phone')} placeholder="Phone" className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
          Save Settings
        </button>
      </form>
    </div>
  )
}
