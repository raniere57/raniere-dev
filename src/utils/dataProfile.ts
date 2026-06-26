import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable, type InputTableFormat } from './inputTable'

export type InferredType = 'empty' | 'integer' | 'decimal' | 'boolean' | 'date' | 'string'

export interface ColumnProfile {
  name: string
  inferredType: InferredType
  total: number
  nullCount: number
  unique: number
  samples: string[]
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/
const BR_DATE_RE = /^\d{2}\/\d{2}\/\d{4}$/

function inferType(values: string[]): InferredType {
  const nonEmpty = values.filter((value) => value.trim() !== '')
  if (nonEmpty.length === 0) return 'empty'

  if (nonEmpty.every((value) => /^(true|false|sim|não|nao|yes|no|0|1)$/i.test(value.trim()))) {
    return 'boolean'
  }

  if (nonEmpty.every((value) => /^-?\d+$/.test(value.trim()))) return 'integer'

  if (nonEmpty.every((value) => /^-?\d+([.,]\d+)?$/.test(value.trim()))) return 'decimal'

  if (nonEmpty.every((value) => DATE_RE.test(value.trim()) || BR_DATE_RE.test(value.trim()))) {
    return 'date'
  }

  return 'string'
}

export function buildDataProfile(input: string, format: InputTableFormat): ColumnProfile[] {
  const table = parseInputTable(input, format)
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')

  return table.headers.map((name, columnIndex) => {
    const values = table.rows.map((row) => row[columnIndex] ?? '')
    const nullCount = values.filter((value) => value.trim() === '').length
    const uniqueValues = Array.from(new Set(values.filter((value) => value.trim() !== '')))

    return {
      name,
      inferredType: inferType(values),
      total: values.length,
      nullCount,
      unique: uniqueValues.length,
      samples: uniqueValues.slice(0, 5),
    }
  })
}

export function profileToText(profiles: ColumnProfile[], rowCount: number): DataToolResult {
  const lines = [
    `Linhas: ${rowCount} · Colunas: ${profiles.length}`,
    '',
    'coluna | tipo | nulos | únicos | amostras',
    '--- | --- | --- | --- | ---',
    ...profiles.map((column) =>
      [
        column.name,
        column.inferredType,
        String(column.nullCount),
        String(column.unique),
        column.samples.join(', ') || '—',
      ].join(' | '),
    ),
  ]

  return {
    output: lines.join('\n'),
    meta: `${rowCount} linha${rowCount === 1 ? '' : 's'} · ${profiles.length} coluna${profiles.length === 1 ? '' : 's'}`,
  }
}

export const dataProfileSample = `id,nome,email,ativo,criado_em
1,Ana,ana@exemplo.com,true,2024-01-15
2,Lucas,,sim,15/03/2024
3,Maria,maria@exemplo.com,false,2024-06-01`
