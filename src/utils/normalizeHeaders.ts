import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type HeaderCase = 'snake' | 'camel' | 'kebab' | 'upper' | 'lower'

function stripAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function cleanToken(text: string): string {
  return stripAccents(text)
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
}

function toSnake(text: string): string {
  return cleanToken(text).toLowerCase().replace(/\s+/g, '_')
}

function toKebab(text: string): string {
  return cleanToken(text).toLowerCase().replace(/\s+/g, '-')
}

function toCamel(text: string): string {
  const parts = cleanToken(text).toLowerCase().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  return parts
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('')
}

function transformHeader(header: string, mode: HeaderCase): string {
  switch (mode) {
    case 'snake':
      return toSnake(header)
    case 'camel':
      return toCamel(header)
    case 'kebab':
      return toKebab(header)
    case 'upper':
      return stripAccents(header).trim().toUpperCase()
    case 'lower':
      return stripAccents(header).trim().toLowerCase()
    default:
      return header
  }
}

export function normalizeTableHeaders(input: string, mode: HeaderCase): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')

  const nextHeaders = table.headers.map((header) => transformHeader(header, mode) || header)
  const delimiter = detectDelimiter(input.trim())
  const output = serializeDelimited([nextHeaders, ...table.rows], delimiter)

  return {
    output,
    meta: `${nextHeaders.length} coluna${nextHeaders.length === 1 ? '' : 's'} · ${mode}`,
  }
}

export const normalizeHeadersSample = `ID Cliente,Nome Completo,E-mail Principal
1,Ana Silva,ana@exemplo.com`
