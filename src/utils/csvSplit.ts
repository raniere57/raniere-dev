import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type SplitMode = 'rows' | 'column'

export function splitCsv(
  input: string,
  mode: SplitMode,
  rowsPerFile: number,
  splitColumn: string,
): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (table.rows.length === 0) throw new DataToolError('Nenhuma linha de dados.')

  const delimiter = detectDelimiter(input.trim())
  const chunks: string[] = []

  if (mode === 'rows') {
    if (!Number.isFinite(rowsPerFile) || rowsPerFile < 1) {
      throw new DataToolError('Informe um tamanho de bloco maior que zero.')
    }

    for (let index = 0; index < table.rows.length; index += rowsPerFile) {
      const slice = table.rows.slice(index, index + rowsPerFile)
      const part = Math.floor(index / rowsPerFile) + 1
      chunks.push(
        `# parte-${part}.csv (${slice.length} linha${slice.length === 1 ? '' : 's'})\n${serializeDelimited([table.headers, ...slice], delimiter)}`,
      )
    }
  } else {
    if (!splitColumn) throw new DataToolError('Selecione a coluna para dividir.')
    const columnIndex = table.headers.indexOf(splitColumn)
    if (columnIndex === -1) throw new DataToolError(`Coluna "${splitColumn}" não encontrada.`)

    const groups = new Map<string, string[][]>()
    for (const row of table.rows) {
      const key = row[columnIndex]?.trim() || '(vazio)'
      const bucket = groups.get(key) ?? []
      bucket.push(row)
      groups.set(key, bucket)
    }

    for (const [key, rows] of groups) {
      const safeName = key.replace(/[^\w.-]+/g, '_').slice(0, 40)
      chunks.push(
        `# ${safeName}.csv (${rows.length} linha${rows.length === 1 ? '' : 's'})\n${serializeDelimited([table.headers, ...rows], delimiter)}`,
      )
    }
  }

  return {
    output: chunks.join('\n\n---\n\n'),
    meta: `${chunks.length} parte${chunks.length === 1 ? '' : 's'}`,
  }
}

export const csvSplitSample = `regiao,cidade,valor
N,SP,100
N,RJ,120
S,Curitiba,80
S,Porto Alegre,90`
