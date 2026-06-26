import { useMemo, useState } from 'react'
import { segmentsToJsonPath, type PathSegment } from '../../../utils/jsonPath'

function previewValue(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value.length > 48 ? `${value.slice(0, 48)}…` : value}"`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.length} itens]`
  if (typeof value === 'object') return `{${Object.keys(value as object).length} chaves}`
  return String(value)
}

function typeLabel(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

interface JsonPathTreeNodeProps {
  label: string
  value: unknown
  path: PathSegment[]
  selectedPath: string | null
  onSelect: (path: PathSegment[]) => void
  depth: number
  defaultOpen?: boolean
}

function JsonPathTreeNode({
  label,
  value,
  path,
  selectedPath,
  onSelect,
  depth,
  defaultOpen = depth < 2,
}: JsonPathTreeNodeProps) {
  const [open, setOpen] = useState(defaultOpen)
  const pathString = segmentsToJsonPath(path)
  const isSelected = selectedPath === pathString
  const expandable = value !== null && typeof value === 'object'

  const entries = useMemo(() => {
    if (!expandable) return []
    if (Array.isArray(value)) {
      return value.map((item, index) => ({
        key: `[${index}]`,
        value: item,
        path: [...path, { kind: 'index' as const, index }],
      }))
    }
    return Object.entries(value as Record<string, unknown>).map(([key, item]) => ({
      key,
      value: item,
      path: [...path, { kind: 'key' as const, key }],
    }))
  }, [expandable, path, value])

  if (!expandable) {
    return (
      <button
        type="button"
        className={`tool-json-tree__row tool-json-tree__row--leaf${isSelected ? ' is-selected' : ''}`}
        style={{ paddingLeft: `${depth * 0.85 + 0.45}rem` }}
        onClick={() => onSelect(path)}
      >
        <span className="tool-json-tree__key">{label}</span>
        <span className="tool-json-tree__type">{typeLabel(value)}</span>
        <span className="tool-json-tree__value">{previewValue(value)}</span>
      </button>
    )
  }

  return (
    <div className="tool-json-tree__branch">
      <div
        className={`tool-json-tree__row${isSelected ? ' is-selected' : ''}`}
        style={{ paddingLeft: `${depth * 0.85 + 0.45}rem` }}
      >
        <button
          type="button"
          className="tool-json-tree__toggle"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? 'Recolher' : 'Expandir'}
        >
          {open ? '▾' : '▸'}
        </button>
        <button type="button" className="tool-json-tree__select" onClick={() => onSelect(path)}>
          <span className="tool-json-tree__key">{label}</span>
          <span className="tool-json-tree__type">{typeLabel(value)}</span>
          <span className="tool-json-tree__value">{previewValue(value)}</span>
        </button>
      </div>
      {open &&
        entries.map((entry) => (
          <JsonPathTreeNode
            key={`${pathString}-${entry.key}`}
            label={entry.key}
            value={entry.value}
            path={entry.path}
            selectedPath={selectedPath}
            onSelect={onSelect}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}

interface JsonPathExplorerProps {
  data: unknown
  selectedPath: string | null
  onSelectPath: (path: string) => void
}

export function JsonPathExplorer({ data, selectedPath, onSelectPath }: JsonPathExplorerProps) {
  return (
    <div className="tool-json-tree tool-json-tree--fill">
      <JsonPathTreeNode
        label="$"
        value={data}
        path={[]}
        selectedPath={selectedPath}
        onSelect={(path) => onSelectPath(segmentsToJsonPath(path))}
        depth={0}
        defaultOpen
      />
    </div>
  )
}
