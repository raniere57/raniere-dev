import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export function stackCsvTables(inputs: string[], alignColumns: boolean): DataToolResult {
  const tables = inputs
    .map((input) => input.trim())
    .filter(Boolean)
    .map((input) => parseInputTable(input, 'auto'))

  if (tables.length === 0) throw new DataToolError('Cole ao menos uma tabela CSV.')
  if (tables.some((table) => table.headers.length === 0)) {
    throw new DataToolError('Todas as tabelas precisam ter cabeçalho.')
  }

  const headers = alignColumns
    ? Array.from(
        tables.reduce((set, table) => {
          table.headers.forEach((header) => set.add(header))
          return set
        }, new Set<string>()),
      )
    : tables[0].headers

  if (!alignColumns) {
    const reference = tables[0].headers.join('\u0001')
    const mismatch = tables.find((table) => table.headers.join('\u0001') !== reference)
    if (mismatch) {
      throw new DataToolError('As colunas não coincidem. Ative "Alinhar colunas" para unir mesmo assim.')
    }
  }

  const rows = tables.flatMap((table) =>
    table.rows.map((row) =>
      headers.map((header) => {
        const index = table.headers.indexOf(header)
        return index === -1 ? '' : (row[index] ?? '')
      }),
    ),
  )

  const delimiter = detectDelimiter(inputs.find((input) => input.trim()) ?? ',')
  const output = serializeDelimited([headers, ...rows], delimiter)

  return {
    output,
    meta: `${rows.length} linha${rows.length === 1 ? '' : 's'} · ${tables.length} tabela${tables.length === 1 ? '' : 's'}`,
  }
}

export const csvStackSamples = {
  first: `id,nome
1,Ana
2,Lucas`,
  second: `id,nome
3,Maria
4,João`,
}
