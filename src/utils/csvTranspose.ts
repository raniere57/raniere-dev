import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export function transposeCsv(input: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')

  const matrix = [table.headers, ...table.rows]
  const width = Math.max(...matrix.map((row) => row.length), 0)
  const normalized = matrix.map((row) => {
    const copy = [...row]
    while (copy.length < width) copy.push('')
    return copy
  })

  const transposed = Array.from({ length: width }, (_, columnIndex) =>
    normalized.map((row) => row[columnIndex] ?? ''),
  )

  const delimiter = detectDelimiter(input.trim())
  const output = serializeDelimited(transposed, delimiter)

  return {
    output,
    meta: `${transposed.length} linha${transposed.length === 1 ? '' : 's'} · ${transposed[0]?.length ?? 0} coluna${transposed[0]?.length === 1 ? '' : 's'}`,
  }
}

export const csvTransposeSample = `metrica,jan,fev,mar
vendas,120,150,180
leads,40,55,62`
