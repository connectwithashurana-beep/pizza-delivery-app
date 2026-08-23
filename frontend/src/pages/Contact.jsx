import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../services/api.js'

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/contact/', data)
      toast.success('Message sent! We will get back to you soon.')
      reset()
    } catch (error) {
      const message = error.response?.data?.detail || 'We could not send your message. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Contact Us</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Have a question or feedback? Send us a message.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Your Name"
            className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' } })}
            placeholder="Your Email"
            className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <textarea
            {...register('message', { required: 'Message is required' })}
            placeholder="Your Message"
            rows={5}
            className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800"
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>
        <div>
          <input
            {...register('phone')}
            placeholder="Phone (optional)"
            className="w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
