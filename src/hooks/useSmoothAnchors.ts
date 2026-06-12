import { useEffect } from 'react'

/**
 * Rolagem suave para âncoras internas sem gravar o hash na URL.
 * Sem hash, recarregar a página volta sempre ao topo em vez de
 * pular para a última seção visitada.
 */
export function useSmoothAnchors() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return

      const id = anchor.getAttribute('href')?.slice(1)
      const section = id ? document.getElementById(id) : null
      if (!section) return

      event.preventDefault()
      history.replaceState(null, '', window.location.pathname + window.location.search)
      // Sem behavior explícito: o CSS scroll-behavior anima (e o media query
      // de prefers-reduced-motion troca para rolagem instantânea)
      section.scrollIntoView()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
