// pages/contador/pagos.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { CheckCircle, Truck, FileText, Search } from 'lucide-react';

interface Transaccion {
  id: number;
  pedido: { cliente: { nombre: string }; productos: { producto: { nombre: string }; cantidad: number }[] };
  monto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  fecha: string;
  estado: 'pendiente' | 'confirmado' | 'entregado';
}

export default function PagosContador() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroMetodo, setFiltroMetodo] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [reporte, setReporte] = useState<any>(null);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'contador') {
      router.push('/');
      return;
    }

    const fetchTransacciones = async () => {
      const response = await fetch('http://localhost:3000/transacciones', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setTransacciones(data);
    };
    fetchTransacciones();
  }, [usuario, router]);

  if (!usuario || usuario.rol !== 'contador') {
    return null;
  }

  const transaccionesFiltradas = transacciones.filter((transaccion) => {
    const matchesEstado = filtroEstado === 'todos' || transaccion.estado === filtroEstado;
    const matchesMetodo = filtroMetodo === 'todos' || transaccion.metodoPago === filtroMetodo;
    const matchesBusqueda = transaccion.pedido.cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEstado && matchesMetodo && matchesBusqueda;
  });

  const handleConfirmarPago = async (id: number) => {
    const response = await fetch(`http://localhost:3000/transacciones/${id}/confirmar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const updatedTransaccion = await response.json();
    setTransacciones((prev) =>
      prev.map((transaccion) => (transaccion.id === id ? updatedTransaccion : transaccion))
    );
    alert(`Pago #${id} confirmado.`);
  };

  const handleRegistrarEntrega = async (id: number) => {
    const response = await fetch(`http://localhost:3000/transacciones/${id}/entregar`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const updatedTransaccion = await response.json();
    setTransacciones((prev) =>
      prev.map((transaccion) => (transaccion.id === id ? updatedTransaccion : transaccion))
    );
    alert(`Entrega del pago #${id} registrada.`);
  };

  const handleGenerarReporte = async () => {
    const response = await fetch('http://localhost:3000/transacciones/reporte', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await response.json();
    setReporte(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {mostrarReporte ? 'Reporte Financiero' : 'Gestión de Pagos'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setMostrarReporte(!mostrarReporte);
                if (!mostrarReporte) handleGenerarReporte();
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition flex items-center gap-2"
            >
              <FileText size={20} />
              {mostrarReporte ? 'Ver Pagos' : 'Ver Reporte'}
            </button>
            {!mostrarReporte && (
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

        {!mostrarReporte && (
          <div className="mb-6 flex gap-4">
            <div>
              <label className="mr-2 font-medium text-gray-700">Filtrar por estado:</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="mr-2 font-medium text-gray-700">Filtrar por método:</label>
              <select
                value={filtroMetodo}
                onChange={(e) => setFiltroMetodo(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="todos">Todos</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
          </div>
        )}

        {mostrarReporte && reporte ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reporte Financiero</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Ingresos Totales:</span>
                <span className="text-xl font-bold text-gray-900">
                  ${reporte.ingresosTotales.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transacciones Entregadas:</span>
                <span className="text-gray-900">{reporte.transaccionesEntregadas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transacciones Pendientes:</span>
                <span className="text-gray-900">{reporte.transaccionesPendientes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transacciones Confirmadas:</span>
                <span className="text-gray-900">{reporte.transaccionesConfirmadas}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6">Pago</th>
                  <th className="py-3 px-6">Fecha</th>
                  <th className="py-3 px-6">Cliente</th>
                  <th className="py-3 px-6">Productos</th>
                  <th className="py-3 px-6">Monto</th>
                  <th className="py-3 px-6">Método de Pago</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500">
                      No hay transacciones que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  transaccionesFiltradas.map((transaccion) => (
                    <tr key={transaccion.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-6">#{transaccion.id}</td>
                      <td className="py-3 px-6">{transaccion.fecha}</td>
                      <td className="py-3 px-6">{transaccion.pedido.cliente.nombre}</td>
                      <td className="py-3 px-6">{transaccion.pedido.productos.map((p) => p.producto.nombre).join(', ')}</td>
                      <td className="py-3 px-6">${transaccion.monto.toLocaleString('es-CL')}</td>
                      <td className="py-3 px-6 capitalize">{transaccion.metodoPago}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            transaccion.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : transaccion.estado === 'confirmado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {transaccion.estado}
                        </span>
                      </td>
                      <td className="py-3 px-6 flex gap-2">
                        {transaccion.estado === 'pendiente' && (
                          <button
                            onClick={() => handleConfirmarPago(transaccion.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Confirmar Pago
                          </button>
                        )}
                        {(transaccion.estado === 'pendiente' || transaccion.estado === 'confirmado') && (
                          <button
                            onClick={() => handleRegistrarEntrega(transaccion.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                          >
                            <Truck size={16} /> Registrar Entrega
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}