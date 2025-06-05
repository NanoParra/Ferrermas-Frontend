// pages/admin/dashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { BarChart4, FileText, Tag, TrendingUp, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';

interface DashboardMetrics {
  ventasMensuales: number;
  productosVendidos: number;
  productoMasVendido: string;
  promocionesActivas: number;
  totalProductos: number;
  productosConPocasUnidades: number;
}

export default function AdminDashboard() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    ventasMensuales: 0,
    productosVendidos: 0,
    productoMasVendido: '',
    promocionesActivas: 0,
    totalProductos: 0,
    productosConPocasUnidades: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      router.push('/');
      return;
    }

    const fetchDashboardMetrics = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las métricas');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err: any) {
        setError(err?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [usuario, router]);

  if (!usuario || usuario.rol !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Cargando métricas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Panel de Administración
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package size={24} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Productos Vendidos</h2>
              <p className="text-2xl font-bold text-gray-900">{metrics.productosVendidos}</p>
              <Link href="/admin/desempeno" className="text-sm text-blue-500 hover:underline">
                Ver detalles
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Tag size={24} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Promociones Activas</h2>
              <p className="text-2xl font-bold text-gray-900">{metrics.promocionesActivas}</p>
              <Link href="/admin/estrategias" className="text-sm text-green-500 hover:underline">
                Gestionar promociones
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Producto Más Vendido
            </h2>
            <p className="text-gray-900 font-bold">{metrics.productoMasVendido}</p>
            <p className="text-sm text-gray-600 mt-1">Este mes ha sido el más popular entre los clientes.</p>
            <Link href="/admin/desempeno" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
              Ver más estadísticas
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart4 size={20} className="text-orange-500" /> Resumen de Productos
            </h2>
            <p className="text-gray-800 mb-1">Total de productos registrados: <strong>{metrics.totalProductos}</strong></p>
            <p className="text-gray-800 mb-1">Productos con bajo stock (&lt; 10): <strong>{metrics.productosConPocasUnidades}</strong></p>
            <Link href="/admin/productos" className="text-sm text-orange-500 hover:underline">
              Ir al inventario
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
