import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import PizzaCard from '../components/PizzaCard.jsx'
import { useCart } from '../context/CartContext.jsx'

const categories = [
  {
    name: 'Pizza',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Burgers',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Sides',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Drinks',
    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
  },
]

const testimonials = [
  {
    name: 'Aditi Sharma',
    text: 'The flavor, the speed, the packaging — everything feels premium and thoughtfully done.',
    rating: 5,
  },
  {
    name: 'Rohan Mehta',
    text: 'The custom pizza experience is genuinely fun, and the delivery arrived hotter than expected.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    text: 'Clean design, smooth ordering, and the burgers are honestly as good as they look in the photos.',
    rating: 4,
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const { addItem } = useCart()

  useEffect(() => {
    api
      .get('/inventory/pizzas/?is_featured=true')
      .then((res) => {
        setFeatured(res.data.results || res.data)
      })
      .catch(() => {})
  }, [])

  const handleQuickAdd = (pizza) => {
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
      <section className="relative overflow-hidden bg-[#17181d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(231,122,75,0.32),transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),transparent_25%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f8d8c8]">
              🔥 Fresh • Fast • Delicious
            </span>

            <h1 className="mt-6 max-w-xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Good food.
              <span className="block text-[#f5b593]">Delivered with love.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
              Discover delicious pizzas, burgers, sides, drinks and desserts delivered fresh to your doorstep.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-400"
              >
                Order Now
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Menu
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">✓ 4.9 rating</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">✓ 30 min delivery</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">✓ Fresh ingredients</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-[560px] overflow-hidden rounded-[36px] border border-white/10 bg-[#1c1f25] p-3 shadow-[0_25px_80px_rgba(0,0,0,0.38)]">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                alt="Pizza on a wooden tray"
                className="h-[560px] w-full rounded-[28px] object-cover"
              />
            </div>

            <div className="absolute -left-2 top-8 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-soft sm:-left-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Rating</p>
              <p className="mt-1 text-xl font-black">⭐ 4.9</p>
            </div>

            <div className="absolute -right-3 bottom-10 rounded-2xl bg-brand-600 px-4 py-3 text-white shadow-lg shadow-brand-600/30 sm:-right-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-100">Bestseller</p>
              <p className="mt-1 text-lg font-black">🔥 Truffle Melt</p>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
              🚀 30 min delivery
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Browse</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">Popular categories</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              to="/dashboard"
              className="group overflow-hidden rounded-[26px] border border-[#f3e4db] bg-white p-2 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="overflow-hidden rounded-[20px]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-36 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="px-2 pb-2 pt-3">
                <p className="text-base font-bold text-slate-900">{category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Craving something good?</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">Popular near you</h2>
          </div>
          <Link to="/dashboard" className="hidden text-sm font-semibold text-brand-700 sm:inline-flex">
            See all menu →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.slice(0, 4).map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} onAdd={handleQuickAdd} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#e7d6c7] bg-[#fff5ee] p-10 text-center text-slate-500">
            Loading favorite picks...
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#f2e2d8] bg-[#1b1413] shadow-soft">
          <div className="grid items-center gap-6 p-6 md:grid-cols-[1fr_0.8fr] md:p-10">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f7c9ac]">Special offer</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                20% OFF your first order
              </h2>
              <p className="mt-4 max-w-lg text-base text-slate-300">
                Use code <span className="font-bold text-[#ffd8bd]">PIZZA20</span> on your first order and enjoy a premium meal at a starter price.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#f6efe8]"
                >
                  Order Now
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create account
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-2 shadow-2xl"> 
                <img
                  src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80"
                  alt="Dessert promotion"
                  className="h-[260px] w-full rounded-[20px] object-cover sm:h-[320px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff1e8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Why pizza lovers choose us</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">A better way to order</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: '🚀', title: 'Fast delivery', text: 'Average delivery in 30 minutes across the city.' },
              { icon: '🧑‍🍳', title: 'Chef prepared', text: 'Freshly cooked to order, never left sitting around.' },
              { icon: '💬', title: 'Loved by locals', text: 'Trusted by thousands for food quality and consistency.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-[#f2e2d8] bg-white p-7 shadow-soft">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3ea] text-2xl">{item.icon}</div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">What people say</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">Loved by foodies</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((review) => (
            <div key={review.name} className="rounded-[28px] border border-[#f1e4dc] bg-white p-7 shadow-soft">
              <div className="text-lg text-[#f4b067]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              <p className="mt-4 text-base leading-8 text-slate-600">“{review.text}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3ea] text-sm font-bold text-brand-700">
                  {review.name.charAt(0)}
                </div>
                <p className="font-semibold text-slate-800">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
