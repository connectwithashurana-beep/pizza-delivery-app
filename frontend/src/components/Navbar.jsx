import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Menu' },
  { to: '/pizza-builder', label: 'Build a Pizza' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#efe7df] bg-[#fffaf6]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg text-white shadow-lg shadow-brand-600/20">🍕</span>
          <div>
            <span className="block text-lg font-black tracking-tight text-slate-900">PizzaHub</span>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#efe3da] bg-white text-lg text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Cart"
          >
            🛒
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {items.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/orders" className="text-sm font-medium text-slate-600 transition hover:text-brand-700">Orders</Link>
              <Link to="/profile" className="text-sm font-medium text-slate-600 transition hover:text-brand-700">Profile</Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="text-sm font-medium text-slate-600 transition hover:text-brand-700">Login</Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-500"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#efe3da] bg-white text-lg text-slate-700 shadow-sm md:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[#efe3da] bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#fff3ea] hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/orders" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#fff3ea] hover:text-brand-700">Orders</Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#fff3ea] hover:text-brand-700">Profile</Link>
                <button onClick={handleLogout} className="rounded-xl bg-slate-900 px-3 py-2 text-left text-sm font-semibold text-white">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#fff3ea] hover:text-brand-700">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-xl bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
