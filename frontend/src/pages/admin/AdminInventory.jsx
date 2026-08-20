import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'

const categories = [
  { key: 'bases', label: 'Pizza Bases', endpoint: '/inventory/bases/' },
  { key: 'sauces', label: 'Sauces', endpoint: '/inventory/sauces/' },
  { key: 'cheeses', label: 'Cheeses', endpoint: '/inventory/cheeses/' },
  { key: 'vegetables', label: 'Vegetables', endpoint: '/inventory/vegetables/' },
]

export default function AdminInventory() {
  const [active, setActive] = useState(categories[0])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', price: '', stock_quantity: '', is_available: true })
  const [editingId, setEditingId] = useState(null)

  const fetchItems = () => {
    setLoading(true)
    api.get(active.endpoint, { params: { search } }).then((res) => setItems(res.data.results || res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchItems() }, [active, search])

  const resetForm = () => {
    setForm({ name: '', price: '', stock_quantity: '', is_available: true })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.patch(`${active.endpoint}${editingId}/`, form)
        toast.success('Item updated!')
      } else {
        await api.post(active.endpoint, form)
        toast.success('Item added!')
      }
      resetForm()
      fetchItems()
    } catch {
      toast.error('Operation failed.')
    }
  }

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, stock_quantity: item.stock_quantity, is_available: item.is_available })
    setEditingId(item.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await api.delete(`${active.endpoint}${id}/`)
      toast.success('Item deleted.')
      fetchItems()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Inventory Management</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button key={c.key} onClick={() => { setActive(c); resetForm() }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ${
              active.key === c.key ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="h-fit rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="font-bold">{editingId ? 'Edit' : 'Add'} {active.label.slice(0, -1)}</h2>
          <div className="mt-4 space-y-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name" className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900" />
            <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Price" className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900" />
            <input required type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              placeholder="Stock Quantity" className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
              Available
            </label>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-lg bg-primary-600 py-2 font-semibold text-white hover:bg-primary-700">
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2">Cancel</button>
              )}
            </div>
          </div>
        </form>

        <div className="lg:col-span-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${active.label}...`}
            className="mb-4 w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
          {loading ? <Spinner /> : (
            <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Stock</th>
                    <th className="p-3">Status</th><th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t dark:border-gray-700">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">₹{item.price}</td>
                      <td className={`p-3 ${item.stock_quantity < 20 ? 'font-bold text-red-600' : ''}`}>{item.stock_quantity}</td>
                      <td className="p-3">{item.is_available ? '✅' : '❌'}</td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
