import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api.js'

export default function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    api.post(`/auth/verify-email/${token}/`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <>
          <div className="text-6xl">✅</div>
          <h1 className="mt-4 text-2xl font-bold">Email Verified!</h1>
          <Link to="/login" className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-white">Login Now</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="text-6xl">❌</div>
          <h1 className="mt-4 text-2xl font-bold">Verification Failed</h1>
          <p className="mt-2 text-gray-500">This link is invalid or has expired.</p>
        </>
      )}
    </div>
  )
}
