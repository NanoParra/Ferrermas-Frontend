import { createContext, useContext, useState, ReactNode } from 'react'

type ModalContextType = {
  mostrarModal: boolean
  setMostrarModal: (valor: boolean) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [mostrarModal, setMostrarModal] = useState(false)

  return (
    <ModalContext.Provider value={{ mostrarModal, setMostrarModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal debe usarse dentro de ModalProvider')
  return context
}
