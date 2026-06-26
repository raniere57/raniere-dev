import { DataToolError, type DataToolResult } from './dataError'
import {
  detectDelimiter,
  delimitedToObjects,
  objectsToDelimited,
  parseDelimited,
} from './csv'

export type JsonCsvDirection = 'json-to-csv' | 'csv-to-json'

export class ConvertError extends DataToolError {
  constructor(message: string) {
    super(message)
    this.name = 'ConvertError'
  }
}

function normalizeJsonRows(parsed: unknown): Record<string, unknown>[] {
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return []

    if (parsed.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))) {
      return parsed as Record<string, unknown>[]
    }

    if (parsed.every((item) => Array.isArray(item))) {
      const width = Math.max(...parsed.map((row) => (row as unknown[]).length))
      return parsed.map((row, index) => {
        const record: Record<string, unknown> = { linha: index + 1 }
        ;(row as unknown[]).forEach((cell, cellIndex) => {
          record[`col_${cellIndex + 1}`] = cell
        })
        for (let i = (row as unknown[]).length; i < width; i += 1) {
          record[`col_${i + 1}`] = ''
        }
        return record
      })
    }

    return parsed.map((item, index) => ({ valor: item, indice: index + 1 }))
  }

  if (parsed !== null && typeof parsed === 'object') {
    return [parsed as Record<string, unknown>]
  }

  throw new ConvertError(
    'O JSON precisa ser um array de objetos, um objeto único ou um array de valores.',
  )
}

export function jsonToCsv(input: string, delimiter = ','): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new ConvertError('Cole um JSON para converter.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new ConvertError('JSON inválido. Verifique vírgulas, aspas e colchetes.')
  }

  const rows = normalizeJsonRows(parsed)
  if (rows.length === 0) return { output: '', meta: '0 linhas' }

  const output = objectsToDelimited(rows, delimiter)
  const colCount = rows.reduce((max, row) => Math.max(max, Object.keys(row).length), 0)

  return {
    output,
    meta: `${rows.length} linha${rows.length === 1 ? '' : 's'} · ${colCount} coluna${colCount === 1 ? '' : 's'}`,
  }
}

export function csvToJson(input: string, delimiter?: string): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new ConvertError('Cole um CSV para converter.')

  const resolved = delimiter ?? detectDelimiter(trimmed)
  const rows = parseDelimited(trimmed, resolved)
  if (rows.length === 0) throw new ConvertError('Nenhuma linha válida encontrada.')

  const objects = delimitedToObjects(rows)

  return {
    output: JSON.stringify(objects, null, 2),
    meta: `${objects.length} registro${objects.length === 1 ? '' : 's'} · ${rows[0]?.length ?? 0} campo${rows[0]?.length === 1 ? '' : 's'}`,
  }
}

export function convertJsonCsv(direction: JsonCsvDirection, input: string): DataToolResult {
  return direction === 'json-to-csv' ? jsonToCsv(input) : csvToJson(input)
}

export const jsonCsvSamples = {
  json: `[
  { "nome": "Ana Costa", "cargo": "Analista de dados", "cidade": "Teresina" },
  { "nome": "Lucas Mendes", "cargo": "Engenheiro de software", "cidade": "São Paulo" },
  { "nome": "Marina Silva", "cargo": "Product Manager", "cidade": "Recife" }
]`,
  csv: `nome,cargo,cidade
Ana Costa,Analista de dados,Teresina
Lucas Mendes,Engenheiro de software,São Paulo
Marina Silva,Product Manager,Recife`,
}
