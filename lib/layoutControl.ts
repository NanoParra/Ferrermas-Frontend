export const paginasSinLayout = ['/login']

export function requiereLayout(path: string) {
  return !paginasSinLayout.includes(path)
}
