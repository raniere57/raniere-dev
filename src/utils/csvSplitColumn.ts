import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export function splitCsvColumn(
  input: string,
  column: string,
  delimiter: string,
  maxParts: number,
): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (!column) throw new DataToolError('Selecione a coluna para separar.')

  const columnIndex = table.headers.indexOf(column)
  if (columnIndex === -1) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const sep = delimiter === '\\t' ? '\t' : delimiter
  if (!sep) throw new DataToolError('Informe um delimitador.')

  const limit = maxParts > 0 ? maxParts : Infinity
  let maxSplit = 0

  const splitRows = table.rows.map((row) => {
    const source = row[columnIndex] ?? ''
    const parts = source.split(sep)
    const capped = Number.isFinite(limit) ? parts.slice(0, limit) : parts
    maxSplit = Math.max(maxSplit, capped.length)
    return { row, parts: capped }
  })

  const splitHeaders = Array.from({ length: maxSplit }, (_, index) => `${column}_${index + 1}`)
  const outputHeaders = [
    ...table.headers.slice(0, columnIndex),
    ...splitHeaders,
    ...table.headers.slice(columnIndex + 1),
  ]

  const outputRows = splitRows.map(({ row, parts }) => {
    const padded = Array.from({ length: maxSplit }, (_, index) => parts[index] ?? '')
    return [...row.slice(0, columnIndex), ...padded, ...row.slice(columnIndex + 1)]
  })

  const outputDelimiter = detectDelimiter(input.trim())
  const output = serializeDelimited([outputHeaders, ...outputRows], outputDelimiter)

  return {
    output,
    meta: `${maxSplit} coluna${maxSplit === 1 ? '' : 's'} gerada${maxSplit === 1 ? '' : 's'}`,
  }
}

export const csvSplitColumnSample = `id,contato
1,ana@exemplo.com;11999990000
2,lucas@exemplo.com;21988887777`
