import Link from 'next/link'
import { ShoppingCart, Hammer, TrendingUp, Phone } from 'lucide-react'

const productosDestacados = [
  {
    id: 1,
    nombre: 'Martillo Stanley',
    precio: 12990,
    imagen: '/productos/martillo.jpg',
  },
  {
    id: 2,
    nombre: 'Taladro Bosch Percutor',
    precio: 89990,
    imagen: '/productos/taladro.jpg',
  },
  {
    id: 3,
    nombre: 'Cemento Portland',
    precio: 7500,
    imagen: '/productos/cemento.jpg',
  }
]

export default function Home() {
  return (
    <div className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative text-white h-[80vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/fondo.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-bold mb-4">FERREMAS</h1>
          <p className="text-xl mb-6 max-w-xl mx-auto">Soluciones profesionales en ferretería y construcción para tu proyecto.</p>
          <Link href="/cliente/catalogo">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-orange-600 transition">
              Ver Catálogo
            </button>
          </Link>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <ShoppingCart className="mx-auto text-orange-500" size={40} />
            <h3 className="text-xl font-semibold mt-4">Compra Fácil</h3>
            <p className="text-gray-600 mt-2">Compra rápida y sin complicaciones</p>
          </div>
          <div>
            <Hammer className="mx-auto text-orange-500" size={40} />
            <h3 className="text-xl font-semibold mt-4">Calidad Garantizada</h3>
            <p className="text-gray-600 mt-2">Trabajamos con marcas reconocidas</p>
          </div>
          <div>
            <TrendingUp className="mx-auto text-orange-500" size={40} />
            <h3 className="text-xl font-semibold mt-4">Promociones Constantes</h3>
            <p className="text-gray-600 mt-2">Ahorra cada semana con nuevas ofertas</p>
          </div>
        </div>
      </section>

      {/* Productos destacados en grid profesional */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Productos en Promoción</h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {productosDestacados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <div className="overflow-hidden">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-56 object-contain p-4 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{producto.nombre}</h3>
                    <p className="text-orange-600 font-bold text-md mb-4">
                      ${producto.precio.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <Link href="/cliente/catalogo">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition w-full">
                      Comprar Ahora
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Phone className="mx-auto mb-4" size={40} />
          <h2 className="text-3xl font-bold mb-4">¿Necesitas ayuda o una cotización?</h2>
          <p className="mb-6 text-slate-300">Contáctanos por WhatsApp y te responderemos al instante</p>
          <a
            href="https://wa.me/56941969492"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-slate-900 font-semibold px-6 py-3 rounded-full shadow hover:bg-slate-100 transition"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}