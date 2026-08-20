import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="text-7xl">🍕</div>
      <h1 className="mt-4 text-5xl font-extrabold">404</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Oops! This slice doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
        Back to Home
      </Link>
    </div>
  )
}
