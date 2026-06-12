import { useEffect, useRef } from 'react'

const VISIBLE_CLASS = 'is-visible'
const THRESHOLD = 0.15

/**
 * Revela elementos com a classe .reveal dentro do container quando
 * entram na viewport. Cada elemento é revelado uma única vez.
 */
export function useReveal<T extends HTMLElement>() {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = container.classList.contains('reveal')
      ? [container]
      : Array.from(container.querySelectorAll<HTMLElement>('.reveal'))

    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(VISIBLE_CLASS)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: THRESHOLD },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return containerRef
}
