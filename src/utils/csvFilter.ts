import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'not_contains'
  | 'starts'
  | 'ends'
  | 'empty'
  | 'not_empty'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'

export interface RowFilter {
  column: string
  operator: FilterOperator
  value: string
}

function parseNumber(value: string): number | null {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function matchesFilter(cell: string, filter: RowFilter): boolean {
  const trimmed = cell.trim()
  const compare = filter.value.trim()

  switch (filter.operator) {
    case 'empty':
      return trimmed === ''
    case 'not_empty':
      return trimmed !== ''
    case 'eq':
      return trimmed.toLowerCase() === compare.toLowerCase()
    case 'neq':
      return trimmed.toLowerCase() !== compare.toLowerCase()
    case 'contains':
      return trimmed.toLowerCase().includes(compare.toLowerCase())
    case 'not_contains':
      return !trimmed.toLowerCase().includes(compare.toLowerCase())
    case 'starts':
      return trimmed.toLowerCase().startsWith(compare.toLowerCase())
    case 'ends':
      return trimmed.toLowerCase().endsWith(compare.toLowerCase())
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte': {
      const left = parseNumber(trimmed)
      const right = parseNumber(compare)
      if (left === null || right === null) return false
      if (filter.operator === 'gt') return left > right
      if (filter.operator === 'gte') return left >= right
      if (filter.operator === 'lt') return left < right
      return left <= right
    }
    default:
      return true
  }
}

export function filterCsvRows(input: string, filters: RowFilter[]): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (filters.length === 0) throw new DataToolError('Adicione ao menos um filtro.')

  for (const filter of filters) {
    if (!table.headers.includes(filter.column)) {
      throw new DataToolError(`Coluna "${filter.column}" não encontrada.`)
    }
    if (['eq', 'neq', 'contains', 'not_contains', 'starts', 'ends', 'gt', 'gte', 'lt', 'lte'].includes(filter.operator) && !filter.value.trim()) {
      throw new DataToolError(`Informe um valor para o filtro em "${filter.column}".`)
    }
  }

  const filtered = table.rows.filter((row) =>
    filters.every((filter) => {
      const index = table.headers.indexOf(filter.column)
      return matchesFilter(row[index] ?? '', filter)
    }),
  )

  const delimiter = detectDelimiter(input.trim())
  const output = serializeDelimited([table.headers, ...filtered], delimiter)

  return {
    output,
    meta: `${filtered.length} de ${table.rows.length} linha${table.rows.length === 1 ? '' : 's'}`,
  }
}

export const csvFilterSample = `id,nome,cidade,valor
1,Ana,São Paulo,120
2,Lucas,Rio de Janeiro,80
3,Maria,Teresina,95
4,João,São Paulo,150`

export const filterOperatorLabels: Record<FilterOperator, string> = {
  eq: 'igual a',
  neq: 'diferente de',
  contains: 'contém',
  not_contains: 'não contém',
  starts: 'começa com',
  ends: 'termina com',
  empty: 'vazio',
  not_empty: 'não vazio',
  gt: 'maior que',
  gte: 'maior ou igual',
  lt: 'menor que',
  lte: 'menor ou igual',
}
