import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import PizzaCard from '../components/PizzaCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { useCart } from '../context/CartContext.jsx'

const filters = ['All', 'Pizza', 'Burgers', 'Sides', 'Drinks', 'Desserts']
const categoryMap = {
  'Pizza': 'pizza',
  'Burgers': 'burger',
  'Sides': 'sides',
  'Drinks': 'drinks',
  'Desserts': 'desserts'
}

export default function Dashboard() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    let params = { limit: 100 }  // Get all products
    
    if (search) params.search = search
    if (activeFilter !== 'All') {
      params.category = categoryMap[activeFilter]
    }
    
    api
      .get('/inventory/pizzas/', { params })
      .then((res) => setPizzas(res.data.results || res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [search, activeFilter])

  const handleAdd = (pizza) => {
    addItem({
      name: pizza.name,
      unitPrice: Number(pizza.base_price),
      quantity: 1,
      pizzaId: pizza.id,
      type: 'preset',
    })
    toast.success(`${pizza.name} added to cart!`)
  }

  return (
    <div className="bg-[#fffaf5]">
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-[#f1e4dc] bg-gradient-to-r from-[#201a1a] via-[#221d1d] to-[#7d3d23] p-6 shadow-soft sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7d7bb]">Menu</p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-5xl">Fresh favorites for every craving.</h1>
            </div>

            <div className="w-full max-w-xl">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#f5d4b8]">Search</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔎</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pizza, burger, drinks..."
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-3.5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-300 focus:border-[#f8c9a5] focus:ring-4 focus:ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'border border-[#f0dfd4] bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#e7d2c4] hover:text-brand-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {loading ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-[#e7d7ca] bg-white p-10">
            <Spinner />
          </div>
        ) : pizzas.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-[#e7d7ca] bg-white p-10 text-center text-slate-500">
            No food found. Try another search or filter.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {pizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
