import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { CheckCircle } from 'lucide-react'
import { getProductos } from '@/lib/producto' // asegúrate que esta ruta exista

// Tipado del producto
interface Producto {
  id: number
  nombre: string
  precio: number
  imagen: string
  categoria: string
  etiqueta?: 'Oferta' | 'Nuevo' | 'Destacado'
}

const categorias = [
  'Todos',
  'Herramientas Manuales',
  'Herramientas Eléctricas',
  'Materiales Básicos',
  'Acabados',
  'Equipos de Seguridad',
  'Tornillos y Anclajes',
  'Fijaciones y Adhesivos',
  'Equipos de Medición',
] as const

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<typeof categorias[number]>('Todos')
  const [addedProductId, setAddedProductId] = useState<number | null>(null)
  const { agregarProducto } = useCart()

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch((err) => console.error('Error al obtener productos:', err))
  }, [])

  const productosFiltrados = productos.filter(
    (producto) =>
      (filtro === 'Todos' || producto.categoria === filtro) &&
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleAgregar = (producto: Producto) => {
    agregarProducto(producto)
    setAddedProductId(producto.id)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-slate-800">
          Catálogo de Productos
        </h1>

        {/* Filtros y búsqueda */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-orange-500 focus:outline-none"
          />
          <div className="flex flex-wrap justify-center gap-3">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setFiltro(categoria)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filtro === categoria
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-700 border-gray-300 hover:bg-orange-100'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="relative rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {producto.etiqueta && (
                  <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow">
                    {producto.etiqueta}
                  </span>
                )}

                <img
                  src={`/productos/${producto.imagen}`}
                  onError={(e) => {
                    e.currentTarget.src = '/productos/default.jpg'
                  }}
                  alt={producto.nombre}
                  className="h-52 w-full object-contain p-4"
                />

                <div className="p-5">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-700">
                    {producto.categoria}
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-slate-800">
                    {producto.nombre}
                  </h2>
                  <p className="mb-4 font-bold text-orange-600">
                    ${producto.precio.toLocaleString('es-CL')}
                  </p>

                  <button
                    onClick={() => handleAgregar(producto)}
                    className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-white transition-colors ${
                      addedProductId === producto.id
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {addedProductId === producto.id ? (
                      <>
                        <CheckCircle size={18} /> Agregado
                      </>
                    ) : (
                      'Agregar al carrito'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-slate-600">
            No se encontraron productos que coincidan con tu búsqueda.
          </p>
        )}
      </div>
    </div>
  )
}
