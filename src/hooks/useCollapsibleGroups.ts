import { useCallback, useEffect, useState } from 'react'

function readStored<T extends string>(storageKey: string): Set<T> {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((item): item is T => typeof item === 'string'))
  } catch {
    return new Set()
  }
}

interface CollapsibleGroupsOptions<T extends string> {
  storageKey?: string
  initialExpanded?: T
}

export function useCollapsibleGroups<T extends string>(options?: T | CollapsibleGroupsOptions<T>) {
  const resolved: CollapsibleGroupsOptions<T> =
    typeof options === 'string' || options === undefined ? { initialExpanded: options } : options

  const { storageKey, initialExpanded } = resolved

  const [expanded, setExpanded] = useState<Set<T>>(() => {
    if (storageKey) {
      const stored = readStored<T>(storageKey)
      if (stored.size > 0) return stored
    }
    return initialExpanded ? new Set([initialExpanded]) : new Set()
  })

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify([...expanded]))
  }, [expanded, storageKey])

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
