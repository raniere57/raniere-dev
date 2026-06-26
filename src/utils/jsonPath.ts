import { DataToolError, type DataToolResult } from './dataError'

export type PathSegment =
  | { kind: 'key'; key: string }
  | { kind: 'index'; index: number }

export function segmentsToJsonPath(segments: PathSegment[]): string {
  if (segments.length === 0) return '$'

  let path = '$'
  for (const segment of segments) {
    if (segment.kind === 'key') {
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(segment.key)) {
        path += `.${segment.key}`
      } else {
        path += `['${segment.key.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}']`
      }
    } else {
      path += `[${segment.index}]`
    }
  }

  return path
}

export function parseJsonInput(input: string): unknown {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um JSON para explorar.')

  try {
    return JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }
}

function tokenize(path: string): string[] {
  const trimmed = path.trim()
  if (!trimmed) throw new DataToolError('Informe uma expressão JSONPath.')

  let normalized = trimmed
  if (normalized.startsWith('$')) normalized = normalized.slice(1)
  if (normalized.startsWith('.')) normalized = normalized.slice(1)

  const tokens: string[] = []
  let current = ''

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i]

    if (char === '.') {
      if (current) tokens.push(current)
      current = ''
      continue
    }

    if (char === '[') {
      if (current) tokens.push(current)
      current = ''
      const end = normalized.indexOf(']', i)
      if (end === -1) throw new DataToolError('Colchetes não fechados na expressão.')
      const inside = normalized.slice(i + 1, end).trim()
      if (inside === '*') {
        tokens.push('*')
      } else if (/^\d+$/.test(inside)) {
        tokens.push(inside)
      } else {
        throw new DataToolError('Use [*] para iterar arrays ou [0], [1]… para índices.')
      }
      i = end
      current = ''
      continue
    }

    current += char
  }

  if (current) tokens.push(current)
  return tokens
}

function walk(value: unknown, tokens: string[]): unknown[] {
  if (tokens.length === 0) return [value]

  const [token, ...rest] = tokens

  if (token === '*') {
    if (!Array.isArray(value)) return []
    return value.flatMap((item) => walk(item, rest))
  }

  if (/^\d+$/.test(token)) {
    if (!Array.isArray(value)) return []
    return walk(value[Number(token)], rest)
  }

  if (value === null || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  if (!(token in record)) return []
  return walk(record[token], rest)
}

export function queryJsonPath(input: string, path: string): DataToolResult {
  const parsed = parseJsonInput(input)

  const tokens = tokenize(path.startsWith('$') ? path : `$${path.startsWith('.') ? path : `.${path}`}`)
  const matches = walk(parsed, tokens)

  if (matches.length === 0) {
    return { output: '[]', meta: '0 resultados' }
  }

  if (matches.length === 1) {
    return {
      output: JSON.stringify(matches[0], null, 2),
      meta: '1 resultado',
    }
  }

  return {
    output: JSON.stringify(matches, null, 2),
    meta: `${matches.length} resultados`,
  }
}

export const jsonPathSample = {
  input: `{
  "items": [
    { "id": 1, "nome": "Ana" },
    { "id": 2, "nome": "Lucas" }
  ]
}`,
  path: '$.items[*].nome',
}
