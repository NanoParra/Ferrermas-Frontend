import { useCart } from '@/context/CartContext'

export function ProductCard({ producto }: { producto: { id: number; nombre: string; precio: number } }) {
  const { agregarProducto } = useCart()

  return (
    <div className="border p-4 rounded-2xl shadow hover:shadow-lg transition-all">
      <h2 className="text-xl font-semibold">{producto.nombre}</h2>
      <p className="text-lg mt-2 text-gray-700">${producto.precio.toLocaleString('es-CL')}</p>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => agregarProducto(producto)}
      >
        Agregar al carrito
      </button>
    </div>
  )
}
