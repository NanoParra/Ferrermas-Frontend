
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { CheckCircle, Package, Search } from 'lucide-react';

interface Orden {
  id: number;
  cliente: { nombre: string };
  productos: { producto: { nombre: string }; cantidad: number }[];
  fecha: string;
  estado: 'pendiente' | 'preparada' | 'entregada';
}

interface ProductoInventario {
  id: number;
  producto: { nombre: string };
  cantidad: number;
  ubicacion: string;
}

export default function OrdenesBodeguero() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [inventario, setInventario] = useState<ProductoInventario[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [mostrarInventario, setMostrarInventario] = useState(false);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'bodeguero') {
      router.push('/');
      return;
    }

    const fetchOrdenes = async () => {
      const response = await fetch('http://localhost:3000/pedidos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setOrdenes(data);
    };

    const fetchInventario = async () => {
      const response = await fetch('http://localhost:3000/inventario', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setInventario(data);
    };

    fetchOrdenes();
    fetchInventario();
  }, [usuario, router]);

  if (!usuario || usuario.rol !== 'bodeguero') {
    return null;
  }

  const ordenesFiltradas = ordenes.filter((orden) => {
    const matchesEstado = filtroEstado === 'todos' || orden.estado === filtroEstado;
    const matchesBusqueda = orden.cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEstado && matchesBusqueda;
  });

  const handleMarcarPreparada = async (id: number) => {
    const response = await fetch(`http://localhost:3000/pedidos/${id}/preparar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
      const error = await response.json();
      alert(error.message || 'Error al marcar la orden como preparada');
      return;
    }
    const updatedOrden = await response.json();
    setOrdenes((prev) =>
      prev.map((orden) => (orden.id === id ? updatedOrden : orden))
    );

    // Actualizar inventario
    const updatedInventarioResponse = await fetch('http://localhost:3000/inventario', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const updatedInventario = await updatedInventarioResponse.json();
    setInventario(updatedInventario);

    alert(`Orden #${id} marcada como preparada.`);
  };

  const handleActualizarInventario = async (id: number, nuevaCantidad: number) => {
    const response = await fetch(`http://localhost:3000/inventario/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    const updatedItem = await response.json();
    setInventario((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {mostrarInventario ? 'Gestión de Inventario' : 'Órdenes para Preparar'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMostrarInventario(!mostrarInventario)}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition flex items-center gap-2"
            >
              <Package size={20} />
              {mostrarInventario ? 'Ver Órdenes' : 'Ver Inventario'}
            </button>
            {!mostrarInventario && (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {!mostrarInventario && (
          <div className="mb-6">
            <label className="mr-2 font-medium text-gray-700">Filtrar por estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="preparada">Preparada</option>
              <option value="entregada">Entregada</option>
            </select>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          {mostrarInventario ? (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6">Producto</th>
                  <th className="py-3 px-6">Cantidad Disponible</th>
                  <th className="py-3 px-6">Ubicación</th>
                  <th className="py-3 px-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">{producto.producto.nombre}</td>
                    <td className="py-3 px-6">
                      <input
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) =>
                          handleActualizarInventario(producto.id, parseInt(e.target.value))
                        }
                        min="0"
                        className="w-20 border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </td>
                    <td className="py-3 px-6">{producto.ubicacion}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => alert(`Ubicación: ${producto.ubicacion}`)}
                        className="text-orange-500 hover:underline"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6">Orden</th>
                  <th className="py-3 px-6">Fecha</th>
                  <th className="py-3 px-6">Cliente</th>
                  <th className="py-3 px-6">Productos</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No hay órdenes que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((orden) => (
                    <tr key={orden.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-6">#{orden.id}</td>
                      <td className="py-3 px-6">{orden.fecha}</td>
                      <td className="py-3 px-6">{orden.cliente.nombre}</td>
                      <td className="py-3 px-6">
                        {orden.productos.map((p) => `${p.producto.nombre} (x${p.cantidad})`).join(', ')}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            orden.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : orden.estado === 'preparada'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {orden.estado}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {orden.estado === 'pendiente' && (
                          <button
                            onClick={() => handleMarcarPreparada(orden.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Marcar como Preparada
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}