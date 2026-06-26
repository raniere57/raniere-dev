import { DataToolError, type DataToolResult } from './dataError'

export type FlattenDirection = 'flatten' | 'unflatten'

function flattenObject(
  value: Record<string, unknown>,
  prefix = '',
  result: Record<string, unknown> = {},
): Record<string, unknown> {
  Object.entries(value).forEach(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (nested !== null && typeof nested === 'object' && !Array.isArray(nested)) {
      flattenObject(nested as Record<string, unknown>, path, result)
    } else {
      result[path] = nested
    }
  })
  return result
}

function unflattenObject(flat: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  Object.entries(flat).forEach(([path, value]) => {
    const parts = path.split('.')
    let cursor: Record<string, unknown> = result

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value
        return
      }
      if (typeof cursor[part] !== 'object' || cursor[part] === null || Array.isArray(cursor[part])) {
        cursor[part] = {}
      }
      cursor = cursor[part] as Record<string, unknown>
    })
  })

  return result
}

export function flattenJson(input: string, direction: FlattenDirection): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um JSON para achatar ou expandir.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new DataToolError('JSON inválido.')
  }

  if (direction === 'flatten') {
    if (Array.isArray(parsed)) {
      const rows = parsed.map((item, index) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
          return flattenObject(item as Record<string, unknown>)
        }
        return { [`item_${index + 1}`]: item }
      })
      return {
        output: JSON.stringify(rows, null, 2),
        meta: `${rows.length} registro${rows.length === 1 ? '' : 's'} achatado${rows.length === 1 ? '' : 's'}`,
      }
    }

    if (parsed !== null && typeof parsed === 'object') {
      const flat = flattenObject(parsed as Record<string, unknown>)
      return {
        output: JSON.stringify(flat, null, 2),
        meta: `${Object.keys(flat).length} campo${Object.keys(flat).length === 1 ? '' : 's'}`,
      }
    }

    throw new DataToolError('JSON precisa ser objeto ou array de objetos.')
  }

  if (Array.isArray(parsed)) {
    const rows = parsed.map((item) => {
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        return unflattenObject(item as Record<string, unknown>)
      }
      return item
    })
    return {
      output: JSON.stringify(rows, null, 2),
      meta: `${rows.length} registro${rows.length === 1 ? '' : 's'} expandido${rows.length === 1 ? '' : 's'}`,
    }
  }

  if (parsed !== null && typeof parsed === 'object') {
    const expanded = unflattenObject(parsed as Record<string, unknown>)
    return {
      output: JSON.stringify(expanded, null, 2),
      meta: 'Objeto expandido',
    }
  }

  throw new DataToolError('JSON precisa ser objeto ou array de objetos.')
}

export const flattenSample = `{
  "usuario": { "nome": "Ana", "endereco": { "cidade": "Teresina" } },
  "tags": ["dados", "bi"]
}`
