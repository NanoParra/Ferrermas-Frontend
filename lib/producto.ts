// lib/producto.ts
export const getProductos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return await res.json();
  };
  