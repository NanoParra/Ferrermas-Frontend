import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AgregarProducto() {
  const router = useRouter();
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Herramientas Manuales',
    imagen: '',
    etiqueta: '' as 'Oferta' | 'Nuevo' | 'Destacado' | '',
  });
  const [error, setError] = useState<string | null>(null);

  const categorias = [
    'Herramientas Manuales',
    'Herramientas Eléctricas',
    'Materiales Básicos',
    'Acabados',
    'Equipos de Seguridad',
    'Tornillos y Anclajes',
    'Fijaciones y Adhesivos',
    'Equipos de Medición',
  ];

  const etiquetas = ['Oferta', 'Nuevo', 'Destacado'] as const;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.nombre.trim()) return setError('El nombre del producto es obligatorio');
    if (!formulario.precio || parseFloat(formulario.precio) <= 0) return setError('El precio debe ser mayor a 0');
    if (!formulario.stock || parseInt(formulario.stock) < 0) return setError('El stock no puede ser negativo');
    if (!formulario.categoria) return setError('Debe seleccionar una categoría');
    

    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formulario.nombre,
          descripcion: formulario.descripcion || null,
          precio: parseFloat(formulario.precio),
          stock: parseInt(formulario.stock),
          categoria: formulario.categoria,
          imagen: formulario.imagen || '',
          etiqueta: formulario.etiqueta || null,
        }),
      });

      if (!res.ok) throw new Error('Error al registrar producto');

      alert('Producto registrado correctamente');
      router.push('/admin/productos');
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al registrar el producto.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16" />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Agregar Nuevo Producto
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: Martillo Stanley"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Describe el producto..."
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Precio ($CLP)</label>
            <input
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={handleChange}
              required
              min="1"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: 12990"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formulario.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: 50"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Categoría</label>
            <select
              name="categoria"
              value={formulario.categoria}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">URL de la Imagen</label>
            <input
              type="text"
              name="imagen"
              value={formulario.imagen}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: /productos/martillo.jpg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Etiqueta (Opcional)</label>
            <select
              name="etiqueta"
              value={formulario.etiqueta}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Ninguna</option>
              {etiquetas.map((etiqueta) => (
                <option key={etiqueta} value={etiqueta}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
