// pages/admin/productos.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Edit, Trash2, Search, X } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
  etiqueta?: 'Oferta' | 'Nuevo' | 'Destacado';
  descripcion?: string;
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
] as const;

export default function ProductosAdmin() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<typeof categorias[number]>('Todos');
  const [editProducto, setEditProducto] = useState<Producto | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      router.push('/');
      return;
    }

    const fetchProductos = async () => {
      const res = await fetch('http://localhost:3000/productos');
      const data = await res.json();
      setProductos(
        data.map((prod: any) => ({
          id: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          stock: prod.inventario?.cantidad || 0,
          categoria: prod.categoria,
          imagen: prod.imagen,
          etiqueta: prod.etiqueta,
          descripcion: prod.descripcion,
        }))
      );
    };

    fetchProductos();
  }, [usuario, router]);

  const productosFiltrados = productos.filter((producto) =>
    (filtroCategoria === 'Todos' || producto.categoria === filtroCategoria) &&
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    const res = await fetch(`http://localhost:3000/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (res.ok) {
      setProductos(productos.filter((producto) => producto.id !== id));
    } else {
      alert('Error al eliminar el producto.');
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditProducto(producto);
    setShowModal(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (editProducto) {
      setEditProducto({ ...editProducto, [e.target.name]: e.target.value });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProducto) return;

    const res = await fetch(`http://localhost:3000/productos/${editProducto.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(editProducto),
    });

    if (res.ok) {
      setProductos(productos.map((p) => (p.id === editProducto.id ? editProducto : p)));
      setShowModal(false);
      setEditProducto(null);
    } else {
      alert('Error al actualizar el producto.');
    }
  };

  if (!usuario || usuario.rol !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16"></div>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <Link href="/admin/agregar">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
              + Agregar Producto
            </button>
          </Link>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value as typeof categorias[number])}
              className="w-full md:w-48 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Imagen</th>
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-6">Categoría</th>
                <th className="py-3 px-6">Precio</th>
                <th className="py-3 px-6">Stock</th>
                <th className="py-3 px-6">Etiqueta</th>
                <th className="py-3 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6">{producto.id}</td>
                  <td className="py-3 px-6">
                    <img src={producto.imagen} alt={producto.nombre} className="h-12 w-12 object-contain rounded" />
                  </td>
                  <td className="py-3 px-6">{producto.nombre}</td>
                  <td className="py-3 px-6">{producto.categoria}</td>
                  <td className="py-3 px-6">${producto.precio.toLocaleString('es-CL')}</td>
                  <td className="py-3 px-6">{producto.stock}</td>
                  <td className="py-3 px-6">
                    {producto.etiqueta ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                        {producto.etiqueta}
                      </span>
                    ) : (
                      '-' 
                    )}
                  </td>
                  <td className="py-3 px-6 space-x-2">
                    <button onClick={() => handleEdit(producto)} className="text-blue-600 hover:text-blue-800 transition">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(producto.id)} className="text-red-600 hover:text-red-800 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && editProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Editar Producto</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="text" name="nombre" value={editProducto.nombre} onChange={handleEditChange} required className="w-full border px-4 py-2 rounded-md" />
              <textarea name="descripcion" value={editProducto.descripcion || ''} onChange={handleEditChange} rows={3} className="w-full border px-4 py-2 rounded-md" />
              <input type="number" name="precio" value={editProducto.precio} onChange={handleEditChange} required className="w-full border px-4 py-2 rounded-md" />
              <input type="number" name="stock" value={editProducto.stock} onChange={handleEditChange} required className="w-full border px-4 py-2 rounded-md" />
              <input type="text" name="categoria" value={editProducto.categoria} onChange={handleEditChange} required className="w-full border px-4 py-2 rounded-md" />
              <input type="text" name="imagen" value={editProducto.imagen} onChange={handleEditChange} className="w-full border px-4 py-2 rounded-md" />
              <select name="etiqueta" value={editProducto.etiqueta || ''} onChange={handleEditChange} className="w-full border px-4 py-2 rounded-md">
                <option value="">Ninguna</option>
                <option value="Oferta">Oferta</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Destacado">Destacado</option>
              </select>
              <div className="text-right">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
