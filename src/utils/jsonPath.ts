import { DataToolError, type DataToolResult } from './dataError'

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
      if (inside !== '*') throw new DataToolError('Use [*] para iterar arrays.')
      tokens.push('*')
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

  if (value === null || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  if (!(token in record)) return []
  return walk(record[token], rest)
}

export function queryJsonPath(input: string, path: string): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um JSON para consultar.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }

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
