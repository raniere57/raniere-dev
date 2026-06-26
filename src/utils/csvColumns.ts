import { DataToolError, type DataToolResult } from './dataError'
import { detectDelimiter, parseDelimited, serializeDelimited } from './csv'

export function filterCsvColumns(
  input: string,
  selectedColumns: string[],
  order: string[],
): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um CSV para reordenar colunas.')

  const delimiter = detectDelimiter(trimmed)
  const matrix = parseDelimited(trimmed, delimiter)
  if (matrix.length === 0) throw new DataToolError('CSV vazio.')

  const [headerRow, ...dataRows] = matrix
  const headers = headerRow.map((header, index) => header.trim() || `col_${index + 1}`)

  const resolvedOrder =
    order.length > 0
      ? order.filter((column) => headers.includes(column))
      : selectedColumns.filter((column) => headers.includes(column))

  if (resolvedOrder.length === 0) {
    throw new DataToolError('Selecione ao menos uma coluna existente.')
  }

  const indexes = resolvedOrder.map((column) => headers.indexOf(column))
  const rows = [
    resolvedOrder,
    ...dataRows.map((cells) => indexes.map((index) => cells[index] ?? '')),
  ]

  return {
    output: serializeDelimited(rows, delimiter),
    meta: `${dataRows.length} linha${dataRows.length === 1 ? '' : 's'} · ${resolvedOrder.length} coluna${resolvedOrder.length === 1 ? '' : 's'}`,
  }
}

export function listCsvColumns(input: string): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const delimiter = detectDelimiter(trimmed)
  const matrix = parseDelimited(trimmed, delimiter)
  if (matrix.length === 0) return []

  return matrix[0].map((header, index) => header.trim() || `col_${index + 1}`)
}

export const csvColumnsSample = `id,nome,cargo,cidade
1,Ana,Analista,Teresina
2,Lucas,Engenheiro,São Paulo`
