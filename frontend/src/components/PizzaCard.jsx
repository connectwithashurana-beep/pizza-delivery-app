import { useMemo, useState } from 'react'

const categoryImageLibrary = {
  pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1548365328-9f547fb9587c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1513456850225-1d4f2eb0b20d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=900&q=80'
  ],
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=80'
  ],
  sides: [
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1625944230945-1b7d2d7d3e8d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1518013431113-eb8d7c0d5a3d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80'
  ],
  drinks: [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523374228107-6be6b2d0fbc8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80'
  ],
  desserts: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1559622216-dc9d7d4a18fe?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=900&q=80'
  ]
}

export default function PizzaCard({ pizza, onAdd }) {
  const category = String(pizza.category || 'pizza').toLowerCase().trim()
  const safeCategory = categoryImageLibrary[category] ? category : 'pizza'

  const resolveUniqueCategoryImage = (product) => {
    const seedValue = String(product?.id ?? product?.name ?? category ?? 'food-item')
    const hash = [...seedValue].reduce((total, char) => total + char.charCodeAt(0), 0)
    const pool = categoryImageLibrary[safeCategory]
    return pool[hash % pool.length]
  }

  const initialImage = useMemo(() => {
    const preferred = pizza.image || pizza.image_url || null
    return preferred || resolveUniqueCategoryImage(pizza)
  }, [pizza])

  const [image, setImage] = useState(initialImage)

  const rating = pizza.rating || 4.5
  const reviewCount = pizza.review_count || 0
  const deliveryTime = pizza.delivery_time || '25-30 min'
  const discount = pizza.discount || 0

  const handleImageError = () => {
    const fallbackImage = resolveUniqueCategoryImage(pizza)
    if (image !== fallbackImage) {
      setImage(fallbackImage)
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-[#f2e5dd] bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover">
      <div className="relative h-56 overflow-hidden bg-[#f4efe9]">
        <img
          src={image}
          alt={pizza.name || 'Food item'}
          onError={handleImageError}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          {pizza.is_featured && (
            <span className="rounded-full bg-[#fff5ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-700">
              Bestseller
            </span>
          )}

          {!pizza.is_available && (
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Sold out
            </span>
          )}

          {discount > 0 && (
            <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-sm shadow-sm backdrop-blur-sm transition hover:scale-110 hover:bg-white">
          ♥
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {pizza.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {pizza.description || 'Chef-crafted favorite'}
            </p>
          </div>

          <span className="whitespace-nowrap rounded-full bg-[#fff3ea] px-2.5 py-1 text-xs font-semibold text-brand-700">
            {rating} ★
          </span>
        </div>

        {reviewCount > 0 && (
          <p className="mt-2 text-xs text-slate-400">
            ({reviewCount} reviews)
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>⏱ {deliveryTime}</span>
          <span>🔥 Fresh made</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">
              ₹{Math.round(pizza.base_price)}
            </span>

            {discount > 0 && (
              <p className="text-xs text-slate-400 line-through">
                ₹{Math.round(pizza.base_price / (1 - discount / 100))}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAdd && onAdd(pizza)}
            disabled={!pizza.is_available}
            className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {pizza.is_available ? '+ Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </article>
  )
}