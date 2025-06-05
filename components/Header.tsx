// components/Header.tsx
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { AuthModal } from '@/components/modals/AuthModal';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, LayoutDashboard, PackagePlus, Search, LogOut, FileText, TrendingUp, Tag, Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Url } from 'next/dist/shared/lib/router/router';

export default function Header() {
  const { usuario, logout } = useAuth();
  const { setMostrarModal } = useModal();
  const { totalItems } = useCart();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animación suave para el scroll
  const scrollYProgress = useSpring(scrollY, { stiffness: 400, damping: 90 });

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (y) => {
      setScrolled(y > 50); // Cambia el umbral a 50px para un efecto más suave
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Detectar página activa
  const isActive = (path: string) => router.pathname === path ? 'text-orange-500 font-bold' : '';

  // Manejar enlaces protegidos
  const handleProtectedLink = (e: MouseEvent<HTMLAnchorElement>, href: Url) => {
    if (!usuario) {
      e.preventDefault();
      setRedirectAfterLogin(href.toString()); // Guardar la ruta a la que se debe redirigir
      setMostrarModal(true);
    } else {
      setIsLoading(true);
      router.push(href).finally(() => setIsLoading(false));
    }
  };
  // Manejar cierre de sesión
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un error al cerrar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (usuario?.rol === 'admin') {
        router.push(`/admin/productos?search=${searchQuery}`);
      } else {
        router.push(`/cliente/catalogo?search=${searchQuery}`);
      }
    }
  };

  // Header para administradores
  if (usuario?.rol === 'admin') {
    return (
      <>
        <motion.header
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed w-full top-0 z-[100] transition-all duration-300 backdrop-blur-lg border-b border-gray-700 ${
            scrolled ? 'bg-gray-900/95 shadow-lg text-white py-2' : 'bg-gray-900 text-white py-4'
          }`}
        >
          <div className="container mx-auto flex justify-between items-center px-6">
            {/* Logo */}
            <Link href="/admin/dashboard" className="text-2xl font-extrabold tracking-tight hover:text-orange-400 transition-colors flex items-center gap-2">
              <span>🛠️ FERREMAS</span>
              <span className="text-sm font-light ml-1">Admin</span>
            </Link>

            {/* Navegación */}
            <nav className="flex items-center gap-4 text-base">
              {/* Saludo */}
              <div className="hidden sm:block text-sm">
                Bienvenido, {usuario.nombre || 'Admin'}
              </div>

              {/* Buscador */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="pl-8 pr-2 py-1 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </form>

              {/* Enlaces de navegación */}
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-1 hover:text-orange-500 transition ${isActive('/admin/dashboard')}`}
              >
                <LayoutDashboard size={18} /> Panel
              </Link>
              <Link
                href="/admin/agregar"
                className={`flex items-center gap-1 hover:text-orange-500 transition ${isActive('/admin/agregar')}`}
              >
                <PackagePlus size={18} /> Agregar
              </Link>
              <Link
                href="/admin/productos"
                className={`flex items-center gap-1 hover:text-orange-500 transition ${isActive('/admin/productos')}`}
              >
                <ShoppingCart size={18} /> Gestionar
              </Link>
              <Link
                href="/admin/desempeno"
                className={`flex items-center gap-1 hover:text-orange-500 transition ${isActive('/admin/desempeno')}`}
              >
                <TrendingUp size={18} /> Desempeño
              </Link>
              <Link
                href="/admin/estrategias"
                className={`flex items-center gap-1 hover:text-orange-500 transition ${isActive('/admin/estrategias')}`}
              >
                <Tag size={18} /> Estrategias
              </Link>

              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-1 hover:text-red-400 transition"
                aria-label="Cerrar sesión de la cuenta"
              >
                <LogOut size={18} />
                {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
            </nav>
          </div>
        </motion.header>
      </>
    );
  }

  // Header para usuarios no administradores o no autenticados
  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed w-full top-0 z-[100] transition-all duration-500 backdrop-blur-lg border-b border-gray-700 ${
          scrolled ? 'bg-gray-900/90 shadow-lg text-white py-2' : 'bg-gray-900 text-white py-4'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-orange-400 transition-colors flex items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              🛠️ FERREMAS
            </motion.span>
          </Link>

          {/* Navegación para pantallas grandes */}
          <nav className="hidden md:flex items-center gap-6 text-base">
            <Link href="/" className={`hover:text-orange-500 transition-colors ${isActive('/')}`}>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}>
                Inicio
              </motion.div>
            </Link>
            <Link href="/cliente/catalogo" className={`hover:text-orange-500 transition-colors ${isActive('/cliente/catalogo')}`}>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}>
                Catálogo
              </motion.div>
            </Link>

            {/* Buscador */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el catálogo..."
                className={`pl-8 pr-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  scrolled ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                }`}
              />
              <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>

            <a
              href="/cliente/pago"
              onClick={(e) => handleProtectedLink(e, '/cliente/pago')}
              className="relative hover:text-orange-500 transition-colors"
              aria-label="Ver carrito de compras"
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}>
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </a>
            {usuario ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-sm">🔐 {usuario.rol}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center gap-1 hover:text-red-400 transition"
                  aria-label="Cerrar sesión de la cuenta"
                >
                  <LogOut size={18} />
                  {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setMostrarModal(true)}
                className="flex items-center gap-1 hover:text-orange-500 transition text-base"
                aria-label="Iniciar sesión en la cuenta"
              >
                <LogOut size={18} /> Iniciar sesión
              </motion.button>
            )}
          </nav>

          {/* Botón de menú hamburguesa para pantallas pequeñas */}
          <button
            className="md:hidden text-white hover:text-orange-500 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú desplegable para pantallas pequeñas */}
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 text-white px-6 py-4 border-t border-gray-700"
          >
            <div className="flex flex-col gap-4">
              <Link href="/" className={`hover:text-orange-500 transition-colors ${isActive('/')}`} onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
              <Link href="/cliente/catalogo" className={`hover:text-orange-500 transition-colors ${isActive('/cliente/catalogo')}`} onClick={() => setIsMenuOpen(false)}>
                Catálogo
              </Link>

              {/* Buscador en el menú desplegable */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en el catálogo..."
                  className="w-full pl-8 pr-2 py-1 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>

              <a
                href="/cliente/pago"
                onClick={(e) => {
                  handleProtectedLink(e, '/cliente/pago');
                  setIsMenuOpen(false);
                }}
                className="relative hover:text-orange-500 transition-colors"
                aria-label="Ver carrito de compras"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={24} />
                  Carrito
                  {totalItems > 0 && (
                    <span className="absolute -top-2 left-5 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
              </a>
              {usuario ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 hover:text-red-400 transition text-base"
                  aria-label="Cerrar sesión de la cuenta"
                >
                  <LogOut size={18} />
                  {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMostrarModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-orange-500 transition text-base"
                  aria-label="Iniciar sesión en la cuenta"
                >
                  <LogOut size={18} /> Iniciar sesión
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </motion.header>

      <AuthModal />
    </>
  );
}

function setRedirectAfterLogin(arg0: string) {
  throw new Error('Function not implemented.');
}
