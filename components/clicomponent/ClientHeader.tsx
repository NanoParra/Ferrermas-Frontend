// components/cliente/ClientHeader.tsx
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useModal } from '@/context/ModalContext'
import { useCart } from '@/context/CartContext'
import { ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ClientHeader() {
  const { usuario, logout } = useAuth()
  const { setMostrarModal } = useModal()
  const { totalItems } = useCart()

  return (
    <header className="bg-gray-900 text-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center container mx-auto">
        <Link href="/" className="text-2xl font-bold hover:text-orange-400">FERREMÁS</Link>

        <nav className="flex items-center gap-6 text-sm sm:text-base">
          <Link href="/" className="hover:text-orange-400">Inicio</Link>
          <Link href="/cliente/catalogo" className="hover:text-orange-400">Catálogo</Link>

          <Link href="/cliente/pago" className="relative hover:text-orange-400">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {usuario ? (
            <div className="flex items-center gap-2 text-sm">
              <span>🔐 {usuario.rol}</span>
              <button onClick={logout} className="underline hover:text-red-400">Cerrar sesión</button>
            </div>
          ) : (
            <button onClick={() => setMostrarModal(true)} className="underline hover:text-orange-400">Iniciar sesión</button>
          )}
        </nav>
      </div>
    </header>
  )
}
