import { DataToolError, type DataToolResult } from './dataError'

export type NdjsonDirection = 'ndjson-to-json' | 'json-to-ndjson'

export function ndjsonToJson(input: string): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole linhas NDJSON para converter.')

  const lines = trimmed.split('\n').filter((line) => line.trim())
  const values: unknown[] = []

  lines.forEach((line, index) => {
    try {
      values.push(JSON.parse(line))
    } catch {
      throw new DataToolError(`Linha ${index + 1} não é JSON válido.`)
    }
  })

  return {
    output: JSON.stringify(values, null, 2),
    meta: `${values.length} linha${values.length === 1 ? '' : 's'} → array JSON`,
  }
}

export function jsonToNdjson(input: string): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um JSON para converter.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }

  if (!Array.isArray(parsed)) {
    throw new DataToolError('O JSON precisa ser um array para virar NDJSON.')
  }

  const output = parsed.map((item) => JSON.stringify(item)).join('\n')
  return {
    output,
    meta: `${parsed.length} objeto${parsed.length === 1 ? '' : 's'} → NDJSON`,
  }
}

export function convertNdjson(direction: NdjsonDirection, input: string): DataToolResult {
  return direction === 'ndjson-to-json' ? ndjsonToJson(input) : jsonToNdjson(input)
}

export const ndjsonSamples = {
  ndjson: '{"nome":"Ana","cargo":"Analista"}\n{"nome":"Lucas","cargo":"Engenheiro"}',
  json: '[\n  { "nome": "Ana", "cargo": "Analista" },\n  { "nome": "Lucas", "cargo": "Engenheiro" }\n]',
}
