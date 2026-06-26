import { useCallback, useState } from 'react'

export function useCollapsibleGroups<T extends string>(initialExpanded?: T) {
  const [expanded, setExpanded] = useState<Set<T>>(() =>
    initialExpanded ? new Set([initialExpanded]) : new Set(),
  )

  const toggle = useCallback((id: T) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const expand = useCallback((id: T) => {
    setExpanded((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }, [])

  const isExpanded = useCallback(
    (id: T, forceOpen = false) => forceOpen || expanded.has(id),
    [expanded],
  )

  return { toggle, expand, isExpanded }
}
