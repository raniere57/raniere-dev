import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type JoinType = 'inner' | 'left' | 'right' | 'full'

function indexRows(
  headers: string[],
  rows: string[][],
  key: string,
): Map<string, string[][]> {
  const keyIndex = headers.indexOf(key)
  if (keyIndex === -1) throw new DataToolError(`Coluna "${key}" não encontrada.`)

  const map = new Map<string, string[][]>()
  for (const row of rows) {
    const value = row[keyIndex] ?? ''
    const bucket = map.get(value) ?? []
    bucket.push(row)
    map.set(value, bucket)
  }
  return map
}

function mergeHeaders(left: string[], right: string[], rightKey: string): string[] {
  return [...left, ...right.filter((header) => header !== rightKey)]
}

function pickColumns(row: string[], headers: string[], columns: string[]): string[] {
  return columns.map((column) => {
    const index = headers.indexOf(column)
    return index === -1 ? '' : (row[index] ?? '')
  })
}

export function joinCsvTables(
  leftInput: string,
  rightInput: string,
  leftKey: string,
  rightKey: string,
  joinType: JoinType,
): DataToolResult {
  const left = parseInputTable(leftInput, 'auto')
  const right = parseInputTable(rightInput, 'auto')

  if (!leftKey) throw new DataToolError('Informe a coluna-chave da tabela esquerda.')
  if (!rightKey) throw new DataToolError('Informe a coluna-chave da tabela direita.')

  const leftKeyIndex = left.headers.indexOf(leftKey)
  const rightKeyIndex = right.headers.indexOf(rightKey)
  if (leftKeyIndex === -1) throw new DataToolError(`Coluna "${leftKey}" não existe à esquerda.`)
  if (rightKeyIndex === -1) throw new DataToolError(`Coluna "${rightKey}" não existe à direita.`)

  const rightExtra = right.headers.filter((header) => header !== rightKey)
  const outputHeaders = mergeHeaders(left.headers, right.headers, rightKey)
  const rightMap = indexRows(right.headers, right.rows, rightKey)
  const matchedRightKeys = new Set<string>()
  const outputRows: string[][] = []

  for (const leftRow of left.rows) {
    const keyValue = leftRow[leftKeyIndex] ?? ''
    const matches = rightMap.get(keyValue) ?? []

    if (matches.length === 0) {
      if (joinType === 'inner' || joinType === 'right') continue
      outputRows.push([...leftRow, ...rightExtra.map(() => '')])
      continue
    }

    matchedRightKeys.add(keyValue)
    for (const rightRow of matches) {
      outputRows.push([...leftRow, ...pickColumns(rightRow, right.headers, rightExtra)])
    }
  }

  if (joinType === 'right' || joinType === 'full') {
    for (const rightRow of right.rows) {
      const keyValue = rightRow[rightKeyIndex] ?? ''
      if (matchedRightKeys.has(keyValue)) continue

      const emptyLeft = left.headers.map((_header, index) =>
        index === leftKeyIndex ? keyValue : '',
      )
      outputRows.push([...emptyLeft, ...pickColumns(rightRow, right.headers, rightExtra)])
    }
  }

  const delimiter = detectDelimiter(leftInput.trim()) || ','
  const output = serializeDelimited([outputHeaders, ...outputRows], delimiter)

  return {
    output,
    meta: `${outputRows.length} linha${outputRows.length === 1 ? '' : 's'} · join ${joinType}`,
  }
}

export const csvJoinSamples = {
  left: `id,nome
1,Ana
2,Lucas
3,Maria`,
  right: `id,cidade
1,São Paulo
2,Rio de Janeiro
4,Brasília`,
}
