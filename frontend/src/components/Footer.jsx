import { Link } from 'react-router-dom'

const footerColumns = [
  {
    title: 'PizzaHub',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/contact', label: 'Contact' },
      { to: '/dashboard', label: 'Menu' },
      { to: '/pizza-builder', label: 'Build a pizza' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'Our story' },
      { to: '/contact', label: 'Careers' },
      { to: '/dashboard', label: 'Partners' },
      { to: '/contact', label: 'Support' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/contact', label: 'Help center' },
      { to: '/contact', label: 'FAQ' },
      { to: '/contact', label: 'Delivery info' },
      { to: '/contact', label: 'Privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-xl text-white shadow-lg shadow-brand-600/20">🍕</span>
              <div>
                <p className="text-xl font-black text-white">PizzaHub</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Fresh ingredients, chef-crafted flavors, and delivery that feels as premium as the food itself.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xl text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">◎</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">◌</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">◍</span>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">{column.title}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-400">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>Pune, Maharashtra</li>
              <li>+91 98765 43210</li>
              <li>hello@pizzahub.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
