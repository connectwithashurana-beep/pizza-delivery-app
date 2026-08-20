import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

export default function Profile() {
  const { user, fetchProfile } = useAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { username: user?.username, phone: user?.phone, address: user?.address },
  })
  const pwForm = useForm()

  const onSubmit = async (data) => {
    try {
      await api.patch('/auth/profile/', data)
      await fetchProfile()
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile.')
    }
  }

  const onChangePassword = async (data) => {
    try {
      await api.post('/auth/change-password/', { old_password: data.old_password, new_password: data.new_password })
      toast.success('Password changed!')
      pwForm.reset()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="font-bold">Account Details</h2>
        <input value={user?.email} disabled className="w-full rounded-lg border bg-gray-100 px-4 py-2.5 dark:bg-gray-900" />
        <input {...register('username')} placeholder="Username" className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <input {...register('phone')} placeholder="Phone" className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <textarea {...register('address')} placeholder="Address" rows={3} className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
          Save Changes
        </button>
      </form>

      <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="font-bold">Change Password</h2>
        <input type="password" {...pwForm.register('old_password', { required: true })} placeholder="Current Password"
          className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <input type="password" {...pwForm.register('new_password', { required: true, minLength: 8 })} placeholder="New Password"
          className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-900" />
        <button type="submit" className="rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
          Change Password
        </button>
      </form>
    </div>
  )
}
