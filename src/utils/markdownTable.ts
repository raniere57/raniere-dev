import { DataToolError, type DataToolResult } from './dataError'
import { detectDelimiter, parseDelimited, serializeDelimited } from './csv'

export type MarkdownDirection = 'markdown-to-csv' | 'csv-to-markdown'

function parseMarkdownTable(input: string): string[][] {
  const lines = input
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) throw new DataToolError('Tabela Markdown precisa de cabeçalho e separador.')

  const rows = lines
    .filter((line) => !/^\|?[\s:-]+\|[\s|:-]*$/.test(line))
    .map((line) =>
      line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim()),
    )

  if (rows.length === 0) throw new DataToolError('Nenhuma linha válida na tabela Markdown.')
  return rows
}

function toMarkdownTable(rows: string[][]): string {
  if (rows.length === 0) return ''

  const width = Math.max(...rows.map((row) => row.length))
  const normalized = rows.map((row) => {
    const copy = [...row]
    while (copy.length < width) copy.push('')
    return copy
  })

  const header = normalized[0]
  const separator = header.map(() => '---')
  const body = normalized.slice(1)

  const formatRow = (row: string[]) => `| ${row.join(' | ')} |`
  return [formatRow(header), formatRow(separator), ...body.map(formatRow)].join('\n')
}

export function convertMarkdownCsv(direction: MarkdownDirection, input: string): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole Markdown ou CSV para converter.')

  if (direction === 'markdown-to-csv') {
    const rows = parseMarkdownTable(trimmed)
    const output = serializeDelimited(rows, ',')
    return {
      output,
      meta: `${Math.max(rows.length - 1, 0)} linha${rows.length - 1 === 1 ? '' : 's'}`,
    }
  }

  const delimiter = detectDelimiter(trimmed)
  const rows = parseDelimited(trimmed, delimiter)
  if (rows.length === 0) throw new DataToolError('CSV vazio.')

  return {
    output: toMarkdownTable(rows),
    meta: `${rows.length - 1} linha${rows.length - 1 === 1 ? '' : 's'} · Markdown`,
  }
}

export const markdownSamples = {
  markdown: `| nome | cargo |
| --- | --- |
| Ana | Analista |
| Lucas | Engenheiro |`,
  csv: `nome,cargo
Ana,Analista
Lucas,Engenheiro`,
}
