import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type AggregateOp = 'count' | 'sum' | 'avg' | 'min' | 'max'

function parseNumber(value: string): number | null {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function aggregateValues(values: string[], op: AggregateOp): string {
  if (op === 'count') return String(values.length)

  const numbers = values.map(parseNumber).filter((value): value is number => value !== null)
  if (numbers.length === 0) return ''

  switch (op) {
    case 'sum':
      return String(numbers.reduce((total, value) => total + value, 0))
    case 'avg':
      return String(Number((numbers.reduce((total, value) => total + value, 0) / numbers.length).toFixed(4)))
    case 'min':
      return String(Math.min(...numbers))
    case 'max':
      return String(Math.max(...numbers))
    default:
      return ''
  }
}

export function groupCsvRows(
  input: string,
  groupColumn: string,
  valueColumn: string,
  operation: AggregateOp,
): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (!groupColumn) throw new DataToolError('Selecione a coluna de agrupamento.')
  if (!valueColumn && operation !== 'count') {
    throw new DataToolError('Selecione a coluna de valor para agregar.')
  }

  const groupIndex = table.headers.indexOf(groupColumn)
  const valueIndex = valueColumn ? table.headers.indexOf(valueColumn) : -1

  if (groupIndex === -1) throw new DataToolError(`Coluna "${groupColumn}" não encontrada.`)
  if (operation !== 'count' && valueIndex === -1) {
    throw new DataToolError(`Coluna "${valueColumn}" não encontrada.`)
  }

  const buckets = new Map<string, string[]>()

  for (const row of table.rows) {
    const key = row[groupIndex]?.trim() || '(vazio)'
    const bucket = buckets.get(key) ?? []
    if (operation === 'count') {
      bucket.push('1')
    } else {
      bucket.push(row[valueIndex] ?? '')
    }
    buckets.set(key, bucket)
  }

  const resultHeader = `${operation}_${valueColumn || groupColumn}`
  const outputRows = Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([key, values]) => [key, aggregateValues(values, operation)])

  const delimiter = detectDelimiter(input.trim())
  const output = serializeDelimited([[groupColumn, resultHeader], ...outputRows], delimiter)

  return {
    output,
    meta: `${outputRows.length} grupo${outputRows.length === 1 ? '' : 's'} · ${operation}`,
  }
}

export const csvGroupSample = `cidade,valor
São Paulo,120
Rio de Janeiro,80
São Paulo,150
Teresina,95`

export const aggregateLabels: Record<AggregateOp, string> = {
  count: 'Contagem',
  sum: 'Soma',
  avg: 'Média',
  min: 'Mínimo',
  max: 'Máximo',
}
