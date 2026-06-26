import { detectDelimiter, parseDelimited } from './csv'
import { DataToolError } from './dataError'

export type PreviewFormat = 'auto' | 'json' | 'csv'

export interface TablePreviewData {
  headers: string[]
  rows: string[][]
  meta: string
}

function rowsFromJson(input: string): TablePreviewData {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole JSON ou CSV para visualizar.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return { headers: [], rows: [], meta: '0 linhas' }

    if (parsed.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))) {
      const headers = Array.from(
        parsed.reduce((set, row) => {
          Object.keys(row as object).forEach((key) => set.add(key))
          return set
        }, new Set<string>()),
      ) as string[]
      const rows = (parsed as Record<string, unknown>[]).map((row) =>
        headers.map((header) => {
          const value = row[header]
          if (value === null || value === undefined) return ''
          return typeof value === 'object' ? JSON.stringify(value) : String(value)
        }),
      )
      return {
        headers,
        rows,
        meta: `${rows.length} linha${rows.length === 1 ? '' : 's'} · ${headers.length} coluna${headers.length === 1 ? '' : 's'}`,
      }
    }

    const rows = parsed.map((item) => [JSON.stringify(item)])
    return { headers: ['valor'], rows, meta: `${rows.length} linhas · 1 coluna` }
  }

  if (parsed !== null && typeof parsed === 'object') {
    const headers = Object.keys(parsed as object)
    const rows = [headers.map((header) => String((parsed as Record<string, unknown>)[header] ?? ''))]
    return { headers, rows, meta: '1 linha · objeto único' }
  }

  throw new DataToolError('JSON precisa ser array ou objeto para virar tabela.')
}

function rowsFromCsv(input: string): TablePreviewData {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole JSON ou CSV para visualizar.')

  const delimiter = detectDelimiter(trimmed)
  const matrix = parseDelimited(trimmed, delimiter)
  if (matrix.length === 0) throw new DataToolError('CSV vazio.')

  const [headers, ...rows] = matrix
  return {
    headers: headers.map((header, index) => header.trim() || `col_${index + 1}`),
    rows,
    meta: `${rows.length} linha${rows.length === 1 ? '' : 's'} · ${headers.length} coluna${headers.length === 1 ? '' : 's'}`,
  }
}

export function buildTablePreview(input: string, format: PreviewFormat): TablePreviewData {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole JSON ou CSV para visualizar.')

  if (format === 'json') return rowsFromJson(trimmed)
  if (format === 'csv') return rowsFromCsv(trimmed)

  const first = trimmed[0]
  if (first === '[' || first === '{') {
    try {
      return rowsFromJson(trimmed)
    } catch {
      return rowsFromCsv(trimmed)
    }
  }

  return rowsFromCsv(trimmed)
}
