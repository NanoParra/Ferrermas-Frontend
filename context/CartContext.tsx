// context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Producto = {
  imagen: string | undefined
  id: number
  nombre: string
  precio: number
  cantidad?: number
}

type CartContextType = {
  carrito: Producto[]
  agregarProducto: (producto: Producto) => void
  eliminarProducto: (id: number) => void
  vaciarCarrito: () => void
  totalItems: number
  totalPrecio: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<Producto[]>([])

  // Recuperar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('carrito')
    if (storedCart) {
      setCarrito(JSON.parse(storedCart))
    }
  }, [])

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const agregarProducto = (nuevo: Producto) => {
    setCarrito(prev => {
      const existente = prev.find(p => p.id === nuevo.id)
      if (existente) {
        return prev.map(p =>
          p.id === nuevo.id
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        )
      } else {
        return [...prev, { ...nuevo, cantidad: 1 }]
      }
    })
  }

  const eliminarProducto = (id: number) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  const totalItems = carrito.reduce((acc, p) => acc + (p.cantidad || 1), 0)
  const totalPrecio = carrito.reduce((acc, p) => acc + (p.precio * (p.cantidad || 1)), 0)

  return (
    <CartContext.Provider value={{ carrito, agregarProducto, eliminarProducto, vaciarCarrito, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
