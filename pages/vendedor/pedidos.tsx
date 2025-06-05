// pages/vendedor/pedidos.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle, XCircle, FileText, Search } from 'lucide-react';

interface Pedido {
  id: number;
  cliente: { nombre: string };
  productos: { producto: { nombre: string }; cantidad: number }[];
  total: number;
  fecha: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
}

export default function PedidosVendedor() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!usuario || usuario.rol !== 'vendedor') {
      router.push('/');
      return;
    }

    const fetchPedidos = async () => {
      const response = await fetch('http://localhost:3000/pedidos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setPedidos(data);
    };
    fetchPedidos();
  }, [usuario, router]);

  if (!usuario || usuario.rol !== 'vendedor') {
    return null;
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchesEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;
    const matchesBusqueda = pedido.cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEstado && matchesBusqueda;
  });

  const handleAprobar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/pedidos/${id}/aprobar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const updatedPedido = await response.json();
    setPedidos((prev) =>
      prev.map((pedido) => (pedido.id === id ? updatedPedido : pedido))
    );
    alert(`Pedido #${id} aprobado.`);
  };

  const handleRechazar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/pedidos/${id}/rechazar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const updatedPedido = await response.json();
    setPedidos((prev) =>
      prev.map((pedido) => (pedido.id === id ? updatedPedido : pedido))
    );
    alert(`Pedido #${id} rechazado.`);
  };

  const handleGenerarFactura = (pedido: Pedido) => {
    alert(
      `Factura generada para el pedido #${pedido.id}:\nCliente: ${pedido.cliente.nombre}\nProductos: ${pedido.productos.map((p) => p.producto.nombre).join(', ')}\nTotal: $${pedido.total.toLocaleString('es-CL')}\nMétodo de pago: ${pedido.metodoPago}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pedidos Recibidos</h1>
          <div className="flex items-center gap-4">
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
            <Link href="/cliente/catalogo" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
              Ver Catálogo
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <label className="mr-2 font-medium text-gray-700">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-6">Pedido</th>
                <th className="py-3 px-6">Fecha</th>
                <th className="py-3 px-6">Cliente</th>
                <th className="py-3 px-6">Productos</th>
                <th className="py-3 px-6">Total</th>
                <th className="py-3 px-6">Método de Pago</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    No hay pedidos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-6">#{pedido.id}</td>
                    <td className="py-3 px-6">{pedido.fecha}</td>
                    <td className="py-3 px-6">{pedido.cliente.nombre}</td>
                    <td className="py-3 px-6">{pedido.productos.map((p) => p.producto.nombre).join(', ')}</td>
                    <td className="py-3 px-6">${pedido.total.toLocaleString('es-CL')}</td>
                    <td className="py-3 px-6 capitalize">{pedido.metodoPago}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          pedido.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : pedido.estado === 'aprobado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="py-3 px-6 flex gap-2">
                      {pedido.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => handleAprobar(pedido.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(pedido.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition flex items-center gap-1"
                          >
                            <XCircle size={16} /> Rechazar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleGenerarFactura(pedido)}
                        className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition flex items-center gap-1"
                      >
                        <FileText size={16} /> Factura
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}