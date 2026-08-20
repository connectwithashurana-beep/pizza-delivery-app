import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api.js'
import Spinner from '../components/Spinner.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useNavigate } from 'react-router-dom'

const steps = ['Base', 'Sauce', 'Cheese', 'Toppings', 'Review']

const optionImageMap = {
  'thin crust': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=640&q=85',
  'regular crust': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=640&q=85',
  'thick crust': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=640&q=85',
  'stuffed crust': 'https://images.unsplash.com/photo-1593560708920-61dd98c8c8d1?auto=format&fit=crop&w=640&q=85',
  tomato: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=640&q=85',
  'tomato sauce': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=640&q=85',
  bbq: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=640&q=85',
  'bbq sauce': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=640&q=85',
  pesto: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=640&q=85',
  'white sauce': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=640&q=85',
  garlic: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=640&q=85',
  mozzarella: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=640&q=85',
  cheddar: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=640&q=85',
  parmesan: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=640&q=85',
  feta: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=640&q=85',
  'double cheese': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=640&q=85',
  onions: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=85',
  'bell peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=640&q=85',
  mushrooms: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=640&q=85',
  olives: 'https://images.unsplash.com/photo-1509537257950-20f875b03639?auto=format&fit=crop&w=640&q=85',
  tomatoes: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=640&q=85',
  jalapenos: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=640&q=85',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=640&q=85',
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=640&q=85',
  pineapple: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=640&q=85',
  broccoli: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=640&q=85',
}

const fallbackOptionImages = {
  bases: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=640&q=85',
  sauces: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=640&q=85',
  cheeses: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=640&q=85',
  vegetables: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=640&q=85',
}

const getOptionImage = (item, category) => {
  const key = item.name?.trim().toLowerCase()
  return optionImageMap[key] || item.image || fallbackOptionImages[category]
}

export default function PizzaBuilder() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [options, setOptions] = useState({ bases: [], sauces: [], cheeses: [], vegetables: [] })
  const [selection, setSelection] = useState({ base: null, sauce: null, cheese: null, vegetables: [] })
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  // Load pizza builder ingredients from API
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setError(null)
        const [bases, sauces, cheeses, vegetables] = await Promise.all([
          api.get('/inventory/bases/'),
          api.get('/inventory/sauces/'),
          api.get('/inventory/cheeses/'),
          api.get('/inventory/vegetables/'),
        ])
        
        setOptions({
          bases: bases.data.results || bases.data || [],
          sauces: sauces.data.results || sauces.data || [],
          cheeses: cheeses.data.results || cheeses.data || [],
          vegetables: vegetables.data.results || vegetables.data || [],
        })
      } catch (err) {
        console.error('Failed to load pizza builder options:', err)
        setError('Failed to load pizza options. Please refresh the page.')
        toast.error('Could not load pizza options')
      } finally {
        setLoading(false)
      }
    }

    loadOptions()
  }, [])


  // Toggle vegetable/topping selection
  const toggleVeg = (veg) => {
    setSelection((prev) => {
      const exists = prev.vegetables.find((v) => v.id === veg.id)
      return {
        ...prev,
        vegetables: exists 
          ? prev.vegetables.filter((v) => v.id !== veg.id) 
          : [...prev.vegetables, veg],
      }
    })
  }

  // Check if user can proceed to next step
  const canProceed = () => {
    if (step === 0) return selection.base?.id != null
    if (step === 1) return selection.sauce?.id != null
    if (step === 2) return selection.cheese?.id != null
    if (step === 3) return true // Toppings are optional
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return
    setStep((s) => Math.min(steps.length - 1, s + 1))
  }

  // Calculate total price based on selections
  const calculatePrice = () => {
    const basePrice = selection.base ? Number(selection.base.price) : 0
    const saucePrice = selection.sauce ? Number(selection.sauce.price) : 0
    const cheesePrice = selection.cheese ? Number(selection.cheese.price) : 0
    const toppingsPrice = selection.vegetables.reduce((sum, v) => sum + Number(v.price), 0)
    return basePrice + saucePrice + cheesePrice + toppingsPrice
  }

  const totalPrice = calculatePrice()

  // Handle adding the custom pizza to cart
  const handleAddToCart = async () => {
    try {
      // Validate all required selections
      if (!selection.base?.id || !selection.sauce?.id || !selection.cheese?.id) {
        toast.error('Please complete all required steps')
        return
      }

      setIsAddingToCart(true)

      const customPizzaItem = {
        name: `Custom Pizza - ${selection.base.name}`,
        unitPrice: totalPrice,
        quantity: 1,
        type: 'custom',
        baseId: selection.base.id,
        sauceId: selection.sauce.id,
        cheeseId: selection.cheese.id,
        vegetableIds: selection.vegetables.map((v) => v.id),
        details: {
          base: selection.base.name,
          sauce: selection.sauce.name,
          cheese: selection.cheese.name,
          toppings: selection.vegetables.map((v) => v.name),
        },
      }

      addItem(customPizzaItem)
      toast.success('Custom pizza added to cart! 🎉')
      
      // Navigate to cart after a brief delay
      setTimeout(() => {
        navigate('/cart')
      }, 500)
    } catch (err) {
      console.error('Error adding pizza to cart:', err)
      toast.error('Failed to add pizza to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400">{error}</h2>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Render option grid with better styling and selection feedback
  const renderOptionGrid = (items, selected, onSelect, category) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onSelect(item)}
          className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-gray-800 ${
            selected?.id === item.id
              ? 'border-primary-600 bg-primary-50 shadow-md dark:bg-primary-900/30'
              : 'border-gray-200 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500'
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-black-900`}
          aria-pressed={selected?.id === item.id}
        >
          <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-gray-100 sm:h-36 dark:bg-gray-700">
            <img
              src={getOptionImage(item, category)}
              alt={`${item.name} option`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          {selected?.id === item.id && (
            <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm text-white shadow-md">
              ✓
            </div>
          )}
          
          <div className="px-1 pb-1">
            <p className="pr-6 font-semibold text-gray-900 dark:text-white">{item.name}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">+₹{Number(item.price).toFixed(2)}</p>
          </div>
        </button>
      ))}
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold md:text-4xl">Build Your Pizza 🍕</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Customize your perfect pizza in 5 easy steps</p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              {/* Step number circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i === step
                    ? 'bg-primary-600 text-white shadow-lg'
                    : i < step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 transition-colors ${
                    i < step ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step title and description */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-600">Step {step + 1} of {steps.length}</p>
            <h2 className="text-2xl font-bold">{steps[step]}</h2>
          </div>
          {/* Current price display */}
          <div className="rounded-lg bg-primary-50 px-4 py-2 dark:bg-primary-900/20">
            <p className="text-xs text-gray-600 dark:text-gray-400">Current Total</p>
            <p className="text-2xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        {step === 0 && (
          <div>
            <p className="mb-4 text-sm text-gray-800 dark:text-gray-400">
              Choose your pizza crust
            </p>
            {renderOptionGrid(
              options.bases,
              selection.base,
              (b) => setSelection((s) => ({ ...s, base: b })),
              'bases'
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-800">
              Choose your sauce
            </p>
            {renderOptionGrid(
              options.sauces,
              selection.sauce,
              (s2) => setSelection((s) => ({ ...s, sauce: s2 })),
              'sauces'
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Choose your cheese
            </p>
            {renderOptionGrid(
              options.cheeses,
              selection.cheese,
              (c) => setSelection((s) => ({ ...s, cheese: c })),
              'cheeses'
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Add toppings (optional - select multiple or skip)
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {options.vegetables.map((veg) => {
                const isSelected = selection.vegetables.find((v) => v.id === veg.id)
                return (
                  <button
                    type="button"
                    key={veg.id}
                    onClick={() => toggleVeg(veg)}
                    className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-gray-800 ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 shadow-md dark:bg-primary-900/30'
                        : 'border-gray-200 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500'
                    } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
                    aria-pressed={!!isSelected}
                  >
                    <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-gray-100 sm:h-36 dark:bg-gray-700">
                      <img
                        src={getOptionImage(veg, 'vegetables')}
                        alt={`${veg.name} topping option`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>

                    {isSelected && (
                      <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm text-white shadow-md">
                        ✓
                      </div>
                    )}
                    <div className="px-1 pb-1">
                      <p className="pr-6 font-semibold text-gray-900 dark:text-white">{veg.name}</p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">+₹{Number(veg.price).toFixed(2)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="mb-4 text-lg font-bold">Review Your Pizza</h3>
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Base:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selection.base?.name}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600" />
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Sauce:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selection.sauce?.name}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600" />
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Cheese:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selection.cheese?.name}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600" />

                <div className="flex items-start justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Toppings:</span>
                  <span className="text-right font-semibold text-gray-900 dark:text-gray">
                    {selection.vegetables.length > 0
                      ? selection.vegetables.map((v) => v.name).join(', ')
                      : 'None'}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600" />

                {/* Price breakdown */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Base:</span>
                    <span>₹{Number(selection.base?.price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sauce:</span>
                    <span>₹{Number(selection.sauce?.price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cheese:</span>
                    <span>₹{Number(selection.cheese?.price || 0).toFixed(2)}</span>
                  </div>
                  {selection.vegetables.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Toppings:</span>
                      <span>₹{selection.vegetables.reduce((sum, v) => sum + Number(v.price), 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Price */}
              <div className="mt-6 border-t-2 border-gray-300 pt-4 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray">Total Price:</span>
                  <span className="text-3xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-900 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Back
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-gray transition-all hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-700 disabled:opacity-100 disabled:hover:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-300 dark:disabled:hover:bg-gray-700 border-2 border-gray-300"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selection.base?.id || !selection.sauce?.id || !selection.cheese?.id}
            className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? 'Adding...' : '✓ Add to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}
