import { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';

export function AuthModal() {
  const { mostrarModal, setMostrarModal } = useModal();
  const { login } = useAuth();
  const router = useRouter();
  const [esLogin, setEsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    rol: 'cliente' as 'cliente' | 'admin' | 'vendedor' | 'bodeguero' | 'contador',
    nombre: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mostrarModal) {
      setForm({
        email: '',
        password: '',
        rol: 'cliente',
        nombre: '',
      });
      setError(null);
      setEsLogin(true);
    }
  }, [mostrarModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getRedirectPath = (rol: string) => {
    const storedRedirect = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin');

    return (
      storedRedirect ||
      (rol === 'cliente'
        ? '/cliente/catalogo'
        : `/${rol}/${rol === 'admin'
            ? 'dashboard'
            : rol === 'vendedor'
            ? 'pedidos'
            : rol === 'bodeguero'
            ? 'ordenes'
            : 'pagos'}`)
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      await login({
        id: data.user.id,
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.rol,
      });

      localStorage.setItem('token', data.access_token);
      setMostrarModal(false);
      router.push(getRedirectPath(data.user.rol));
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      await login({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
      });

      localStorage.setItem('token', data.access_token);
      setMostrarModal(false);
      router.push(getRedirectPath(data.rol));
    } catch (err) {
      setError(err.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMostrarModal(false);
    setError(null);
  };

  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative animate-fade-in scale-95 animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>

        {error && (
          <div className="col-span-1 md:col-span-2 p-4 bg-red-100 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Rol</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
                <option value="bodeguero">Bodeguero</option>
                <option value="contador">Contador</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition disabled:bg-orange-300"
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={() => setEsLogin(false)}
              className="text-orange-500 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        <div className={`${esLogin ? 'hidden md:block' : 'block'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrarse</h2>
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:bg-green-300"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => setEsLogin(true)}
              className="text-orange-500 hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
