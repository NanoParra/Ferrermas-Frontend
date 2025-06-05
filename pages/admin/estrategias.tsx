// pages/admin/estrategias.tsx
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';

export default function Estrategias() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [promociones, setPromociones] = useState([
    { id: 1, nombre: 'Descuento 20% en Herramientas', fechaInicio: '2025-04-01', fechaFin: '2025-04-30' },
    { id: 2, nombre: 'Oferta en Pinturas', fechaInicio: '2025-04-01', fechaFin: '2025-04-15' },
  ]);
  const [nuevaPromocion, setNuevaPromocion] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
  });

  // Redirigir si no es administrador
  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      router.push('/');
    }
  }, [usuario, router]);

  if (!usuario || usuario.rol !== 'admin') {
    return null;
  }

  const handleAddPromocion = (e: React.FormEvent) => {
    e.preventDefault();
    setPromociones([
      ...promociones,
      { id: promociones.length + 1, ...nuevaPromocion },
    ]);
    setNuevaPromocion({ nombre: '', fechaInicio: '', fechaFin: '' });
  };

  const handleDeletePromocion = (id: number) => {
    setPromociones(promociones.filter((promo) => promo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Estrategias y Promociones
        </h1>

        {/* Formulario para agregar promoción */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Tag size={20} className="text-green-500" /> Agregar Nueva Promoción
          </h2>
          <form onSubmit={handleAddPromocion} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Nombre de la Promoción
              </label>
              <input
                type="text"
                value={nuevaPromocion.nombre}
                onChange={(e) =>
                  setNuevaPromocion({ ...nuevaPromocion, nombre: e.target.value })
                }
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={nuevaPromocion.fechaInicio}
                  onChange={(e) =>
                    setNuevaPromocion({
                      ...nuevaPromocion,
                      fechaInicio: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-700">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={nuevaPromocion.fechaFin}
                  onChange={(e) =>
                    setNuevaPromocion({
                      ...nuevaPromocion,
                      fechaFin: e.target.value,
                    })
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
              >
                Agregar Promoción
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Promociones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Promociones Activas
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Fecha de Inicio</th>
                <th className="py-2 px-4">Fecha de Fin</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promociones.map((promo) => (
                <tr key={promo.id} className="border-b">
                  <td className="py-2 px-4">{promo.nombre}</td>
                  <td className="py-2 px-4">{promo.fechaInicio}</td>
                  <td className="py-2 px-4">{promo.fechaFin}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeletePromocion(promo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}