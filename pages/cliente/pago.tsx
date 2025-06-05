import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';
import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';

export default function PagoCliente() {
  const { carrito } = useCart();
  const { usuario } = useAuth();
  const { setMostrarModal } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!usuario) {
      localStorage.setItem('redirectAfterLogin', '/cliente/pago');
      setMostrarModal(true);
    }
  }, [usuario]);

  const total = useMemo(
    () => carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0),
    [carrito]
  );

  const handlePagar = async () => {
    if (carrito.length === 0) return alert('Tu carrito está vacío.');

    setLoading(true);
    try {
      const items = carrito.map((p: any) => ({
        title: p.nombre,
        quantity: p.cantidad || 1,
        unit_price: p.precio,
      }));

      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al generar el enlace de pago.');
      }
    } catch (error) {
      alert('Error en el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center justify-center gap-2 mb-5 text-orange-500">
          <ShoppingCart className="w-5 h-5" />
          <h1 className="text-lg font-bold text-gray-900">Resumen de Pago</h1>
        </div>

        {carrito.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-5">
            <ul className="space-y-2">
              {carrito.map((p, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-gray-100 rounded px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">{p.nombre}</p>
                    <p className="text-xs text-gray-500">Cantidad: {p.cantidad || 1}</p>
                  </div>
                  <p className="text-gray-700 font-medium">
                    ${(p.precio * (p.cantidad || 1)).toLocaleString('es-CL')}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex justify-between border-t pt-3 text-base font-semibold text-gray-800">
              <span>Total</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>

            <button
              onClick={handlePagar}
              disabled={loading}
              className={`w-full mt-3 py-2 text-sm font-semibold rounded-md text-white transition ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Procesando...' : '💳 Pagar con Mercado Pago'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
