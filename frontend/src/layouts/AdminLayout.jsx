import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/admin/dashboard', label: '📊 Dashboard' },
  { to: '/admin/pizzas', label: '🍕 Pizzas' },
  { to: '/admin/inventory', label: '📦 Inventory' },
  { to: '/admin/orders', label: '🧾 Orders' },
  { to: '/admin/analytics', label: '📈 Analytics' },
  { to: '/admin/settings', label: '⚙️ Settings' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <aside className="hidden w-64 flex-col bg-gray-900 text-gray-200 md:flex">
        <div className="p-6 text-xl font-bold text-white">🍕 Admin Panel</div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium ${
                location.pathname === l.to ? 'bg-primary-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <p className="mb-2 text-xs text-gray-400">{user?.email}</p>
          <button onClick={handleLogout} className="w-full rounded-lg bg-red-600 py-2 text-sm text-white hover:bg-red-700">
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
