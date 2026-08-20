import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'pizza_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => [...prev, { ...item, cartId: Date.now() + Math.random() }])
  }

  const increaseQty = (cartId) => {
    setItems((prev) => prev.map((i) => (i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i)))
  }

  const decreaseQty = (cartId) => {
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i)),
    )
  }

  const removeItem = (cartId) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId))
  }

  const clearCart = () => setItems([])

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const gst = +(subtotal * 0.05).toFixed(2)
  const deliveryCharge = items.length ? 40 : 0
  const grandTotal = +(subtotal + gst + deliveryCharge).toFixed(2)

  return (
    <CartContext.Provider
      value={{ items, addItem, increaseQty, decreaseQty, removeItem, clearCart, subtotal, gst, deliveryCharge, grandTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
