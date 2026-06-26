import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type SortDirection = 'asc' | 'desc'

export interface SortRule {
  column: string
  direction: SortDirection
}

function compareValues(a: string, b: string): number {
  const aTrim = a.trim()
  const bTrim = b.trim()

  const aNum = Number(aTrim.replace(',', '.'))
  const bNum = Number(bTrim.replace(',', '.'))
  if (aTrim !== '' && bTrim !== '' && Number.isFinite(aNum) && Number.isFinite(bNum)) {
    return aNum - bNum
  }

  return aTrim.localeCompare(bTrim, 'pt-BR', { sensitivity: 'base' })
}

export function sortCsvRows(input: string, rules: SortRule[]): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (table.rows.length === 0) throw new DataToolError('Nenhuma linha de dados.')
  if (rules.length === 0) throw new DataToolError('Adicione ao menos uma coluna para ordenar.')

  for (const rule of rules) {
    if (!table.headers.includes(rule.column)) {
      throw new DataToolError(`Coluna "${rule.column}" não encontrada.`)
    }
  }

  const sorted = [...table.rows].sort((rowA, rowB) => {
    for (const rule of rules) {
      const index = table.headers.indexOf(rule.column)
      const result = compareValues(rowA[index] ?? '', rowB[index] ?? '')
      if (result !== 0) return rule.direction === 'asc' ? result : -result
    }
    return 0
  })

  const delimiter = detectDelimiter(input.trim())
  const output = serializeDelimited([table.headers, ...sorted], delimiter)

  return {
    output,
    meta: `${sorted.length} linha${sorted.length === 1 ? '' : 's'} ordenada${sorted.length === 1 ? '' : 's'}`,
  }
}

export const csvSortSample = `nome,valor,data
Maria,95,2024-03-01
Ana,120,2024-01-15
Lucas,80,2024-02-20`
