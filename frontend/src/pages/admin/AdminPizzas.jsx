import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import Spinner from '../../components/Spinner.jsx'

const emptyForm = { name: '', description: '', base_price: '', is_available: true, is_featured: false }

export default function AdminPizzas() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const fetchPizzas = () => {
    setLoading(true)
    api.get('/inventory/pizzas/', { params: { search } })
      .then((res) => setPizzas(res.data.results || res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPizzas() }, [search])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.patch(`/inventory/pizzas/${editingId}/`, form)
        toast.success('Pizza updated!')
      } else {
        await api.post('/inventory/pizzas/', form)
        toast.success('Pizza added!')
      }
      resetForm()
      fetchPizzas()
    } catch {
      toast.error('Operation failed.')
    }
  }

  const handleEdit = (pizza) => {
    setForm({
      name: pizza.name,
      description: pizza.description || '',
      base_price: pizza.base_price,
      is_available: pizza.is_available,
      is_featured: pizza.is_featured,
    })
    setEditingId(pizza.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this pizza?')) return
    try {
      await api.delete(`/inventory/pizzas/${id}/`)
      toast.success('Pizza deleted.')
      fetchPizzas()
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold">Pizza Management</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        These are the preset pizzas shown on the Home and Menu pages (separate from the base/sauce/cheese/vegetable
        ingredients used by the pizza builder).
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="h-fit rounded-2xl bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="font-bold">{editingId ? 'Edit' : 'Add'} Pizza</h2>
          <div className="mt-4 space-y-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name" className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description" rows={2} className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900" />
            <input required type="number" step="0.01" value={form.base_price}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
              placeholder="Price" className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              Featured (shows on Home page)
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pizzas..."
            className="mb-4 w-full rounded-lg border px-4 py-2.5 dark:bg-gray-800" />
          {loading ? <Spinner /> : (
            <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-3">Name</th><th className="p-3">Price</th>
                    <th className="p-3">Available</th><th className="p-3">Featured</th><th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pizzas.map((pizza) => (
                    <tr key={pizza.id} className="border-t dark:border-gray-700">
                      <td className="p-3">{pizza.name}</td>
                      <td className="p-3">₹{pizza.base_price}</td>
                      <td className="p-3">{pizza.is_available ? '✅' : '❌'}</td>
                      <td className="p-3">{pizza.is_featured ? '⭐' : ''}</td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => handleEdit(pizza)} className="text-blue-600">Edit</button>
                        <button onClick={() => handleDelete(pizza.id)} className="text-red-600">Delete</button>
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
