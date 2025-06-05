import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  nombre: string
  email: string
  rol: 'cliente' | 'admin' | 'vendedor' | 'bodeguero' | 'contador'
}

interface AuthContextType {
  usuario: User | null
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('usuario')
    if (savedUser) {
      setUsuario(JSON.parse(savedUser))
    }
  }, [])

  const login = async (user: User) => {
    // Aquí integrarás con tu API real
    setUsuario(user)
    localStorage.setItem('usuario', JSON.stringify(user))
  }

  const logout = async () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
