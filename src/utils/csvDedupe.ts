import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable, type InputTableFormat } from './inputTable'

export function dedupeTable(
  input: string,
  keyColumns: string[],
  format: InputTableFormat,
): DataToolResult {
  const table = parseInputTable(input, format)
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (table.rows.length === 0) throw new DataToolError('Nenhuma linha de dados.')

  const keys =
    keyColumns.length > 0
      ? keyColumns.filter((column) => table.headers.includes(column))
      : table.headers

  if (keys.length === 0) throw new DataToolError('Selecione ao menos uma coluna-chave existente.')

  const keyIndexes = keys.map((key) => table.headers.indexOf(key))
  const seen = new Set<string>()
  const uniqueRows: string[][] = []
  let removed = 0

  for (const row of table.rows) {
    const signature = keyIndexes.map((index) => row[index] ?? '').join('\u0001')
    if (seen.has(signature)) {
      removed += 1
      continue
    }
    seen.add(signature)
    uniqueRows.push(row)
  }

  const delimiter = format === 'json' ? ',' : detectDelimiter(input.trim())
  const output = serializeDelimited([table.headers, ...uniqueRows], delimiter)

  return {
    output,
    meta: `${uniqueRows.length} única${uniqueRows.length === 1 ? '' : 's'} · ${removed} removida${removed === 1 ? '' : 's'}`,
  }
}

export const csvDedupeSample = `id,nome,cidade
1,Ana,SP
2,Lucas,RJ
1,Ana,SP
3,Maria,PI`
