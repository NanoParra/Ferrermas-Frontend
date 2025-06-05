import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function Carrito() {
  const { carrito, eliminarProducto, vaciarCarrito } = useCart()

  const total = carrito.reduce((acc, prod) => acc + prod.precio, 0)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {carrito.map((producto, i) => (
              <li key={i} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{producto.nombre}</p>
                  <p className="text-gray-700">${producto.precio.toLocaleString('es-CL')}</p>
                </div>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-xl font-bold">Total: ${total.toLocaleString('es-CL')}</p>
            <div className="mt-4 space-x-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={vaciarCarrito}>
                Vaciar Carrito
              </button>
                <Link href="/cliente/pago">
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                        Ir a Pagar
                    </button>
                </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
