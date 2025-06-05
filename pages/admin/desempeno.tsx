import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

interface ProductoMasVendido {
  nombre: string;
  categoria: string;
  ventas: number;
}

export default function Desempeno() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      router.push('/');
      return;
    }

    const fetchMasVendidos = async () => {
      try {
        const res = await fetch('http://localhost:3000/productos/mas-vendidos');
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProductosMasVendidos(data);
      } catch (err: any) {
        setError(err.message || 'Error de red');
      }
    };

    fetchMasVendidos();
  }, [usuario, router]);

  if (!usuario || usuario.rol !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Desempeño de la Tienda</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Package size={20} className="text-blue-500" /> Productos Más Vendidos
          </h2>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : productosMasVendidos.length === 0 ? (
            <p className="text-gray-500">No hay datos disponibles.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Producto</th>
                  <th className="py-2 px-4">Categoría</th>
                  <th className="py-2 px-4">Ventas</th>
                </tr>
              </thead>
              <tbody>
                {productosMasVendidos.map((producto, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{producto.nombre}</td>
                    <td className="py-2 px-4">{producto.categoria}</td>
                    <td className="py-2 px-4">{producto.ventas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
