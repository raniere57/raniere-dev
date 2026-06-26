import { DataToolError, type DataToolResult } from './dataError'

export type JsonFormatMode = 'pretty' | 'minify'

function formatParseError(message: string, input: string): string {
  const match = message.match(/position (\d+)/i)
  if (!match) return `JSON inválido: ${message}`

  const position = Number(match[1])
  const lines = input.slice(0, position).split('\n')
  const line = lines.length
  const column = (lines.at(-1)?.length ?? 0) + 1
  return `JSON inválido na linha ${line}, coluna ${column}.`
}

export function formatJson(input: string, mode: JsonFormatMode): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um JSON para formatar.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch (error) {
    throw new DataToolError(formatParseError(String(error), trimmed))
  }

  const output =
    mode === 'pretty' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)

  const type = Array.isArray(parsed)
    ? `array · ${parsed.length} item${parsed.length === 1 ? '' : 's'}`
    : typeof parsed

  return {
    output,
    meta: mode === 'pretty' ? `Formatado · ${type}` : `Minificado · ${type}`,
  }
}

export const jsonFormatSample = '{"nome":"Ana","itens":[{"id":1},{"id":2}],"ativo":true}'
