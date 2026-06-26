import { detectDelimiter, parseDelimited } from './csv'
import { DataToolError } from './dataError'

export type InputTableFormat = 'auto' | 'csv' | 'json'

export interface InputTable {
  headers: string[]
  rows: string[][]
}

function tableFromJson(trimmed: string): InputTable {
  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }

  if (!Array.isArray(parsed)) {
    throw new DataToolError('JSON precisa ser um array de objetos.')
  }

  if (parsed.length === 0) return { headers: [], rows: [] }

  if (!parsed.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))) {
    throw new DataToolError('JSON precisa ser um array de objetos.')
  }

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

  return { headers, rows }
}

function tableFromCsv(trimmed: string): InputTable {
  const delimiter = detectDelimiter(trimmed)
  const matrix = parseDelimited(trimmed, delimiter)
  if (matrix.length === 0) throw new DataToolError('CSV vazio.')

  const [headerRow, ...rows] = matrix
  return {
    headers: headerRow.map((header, index) => header.trim() || `col_${index + 1}`),
    rows,
  }
}

export function parseInputTable(input: string, format: InputTableFormat = 'auto'): InputTable {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole dados para processar.')

  if (format === 'json') return tableFromJson(trimmed)
  if (format === 'csv') return tableFromCsv(trimmed)

  if (trimmed[0] === '[' || trimmed[0] === '{') {
    try {
      return tableFromJson(trimmed)
    } catch {
      return tableFromCsv(trimmed)
    }
  }

  return tableFromCsv(trimmed)
}
