import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '@/components/Layout'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { requiereLayout } from '@/lib/layoutControl'
import { ModalProvider } from '@/context/ModalContext'
import 'keen-slider/keen-slider.min.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const mostrarLayout = requiereLayout(router.pathname)

  const contenido = <Component {...pageProps} />

  return (
    <AuthProvider>
      <ModalProvider>
        <CartProvider>
          {mostrarLayout ? <Layout><Component {...pageProps} /></Layout> : <Component {...pageProps} />}
        </CartProvider>
      </ModalProvider>
    </AuthProvider>
  )
}
