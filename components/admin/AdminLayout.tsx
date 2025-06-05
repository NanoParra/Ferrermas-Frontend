import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { BarChart4, PackagePlus, LayoutDashboard } from 'lucide-react'

export default function AdminHeader() {
  const { logout } = useAuth()

  return (
    <header className="bg-gray-900 text-white py-4 px-8 shadow-md w-full fixed top-0 z-50">
      <div className="flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-2xl font-bold tracking-tight hover:text-orange-400 transition">
          FERREMAS Admin
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-orange-400">
            <LayoutDashboard size={18} /> Panel
          </Link>
          <Link href="/admin/agregar" className="flex items-center gap-1 hover:text-orange-400">
            <PackagePlus size={18} /> Agregar Producto
          </Link>
          <Link href="/admin/productos" className="flex items-center gap-1 hover:text-orange-400">
            <BarChart4 size={18} /> Gestionar Productos
          </Link>
          <button
            onClick={logout}
            className="underline hover:text-red-400 transition"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  )
}
