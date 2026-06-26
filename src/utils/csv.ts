import { DataToolError } from './dataError'

export type CsvDelimiter = ',' | ';' | '\t'

export const CSV_DELIMITER_LABELS: Record<CsvDelimiter, string> = {
  ',': 'vírgula (,)',
  ';': 'ponto e vírgula (;)',
  '\t': 'tab (TSV)',
}

function parseDelimitedLine(line: string, delimiter: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }

    current += char
  }

  cells.push(current)
  return cells
}

export function parseDelimited(text: string, delimiter = ','): string[][] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!normalized) return []

  const rows: string[][] = []
  let row = ''
  let inQuotes = false

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i]
    const next = normalized[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        row += '""'
        i += 1
      } else {
        inQuotes = !inQuotes
        row += char
      }
      continue
    }

    if (char === '\n' && !inQuotes) {
      if (row.trim() !== '') rows.push(parseDelimitedLine(row, delimiter))
      row = ''
      continue
    }

    row += char
  }

  if (row.trim() !== '') rows.push(parseDelimitedLine(row, delimiter))
  return rows
}

export function escapeDelimitedCell(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) return ''

  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  if (/["\n\r]/.test(text) || text.includes(delimiter)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export function serializeDelimited(rows: string[][], delimiter = ','): string {
  return rows
    .map((row) => row.map((cell) => escapeDelimitedCell(cell, delimiter)).join(delimiter))
    .join('\n')
}

export function detectDelimiter(text: string): CsvDelimiter {
  const sample = text.trim().split('\n').slice(0, 5).join('\n')
  const counts: Record<CsvDelimiter, number> = { ',': 0, ';': 0, '\t': 0 }

  ;([',', ';', '\t'] as CsvDelimiter[]).forEach((delimiter) => {
    const rows = parseDelimited(sample, delimiter)
    if (rows.length === 0) return
    const width = rows[0]?.length ?? 0
    if (width < 2) return
    const consistent = rows.every((row) => row.length === width)
    if (consistent) counts[delimiter] = width * rows.length
  })

  const best = (Object.entries(counts) as [CsvDelimiter, number][]).sort((a, b) => b[1] - a[1])[0]
  return best?.[1] ? best[0] : ','
}

export function delimitedToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) throw new DataToolError('Nenhuma linha encontrada.')

  const [headerRow, ...dataRows] = rows
  const headers = headerRow.map((header, index) => header.trim() || `col_${index + 1}`)

  return dataRows.map((cells) => {
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? ''
    })
    return record
  })
}

export function objectsToDelimited(
  objects: Record<string, unknown>[],
  delimiter = ',',
): string {
  if (objects.length === 0) return ''

  const headers = Array.from(
    objects.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key))
      return set
    }, new Set<string>()),
  )

  const rows = [
    headers,
    ...objects.map((row) => headers.map((header) => String(row[header] ?? ''))),
  ]

  return serializeDelimited(rows, delimiter)
}

export function convertDelimiter(
  input: string,
  target: CsvDelimiter,
  source?: CsvDelimiter,
): { output: string; meta: string; detected: CsvDelimiter } {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole um CSV ou TSV para converter.')

  const detected = source ?? detectDelimiter(trimmed)
  const rows = parseDelimited(trimmed, detected)
  if (rows.length === 0) throw new DataToolError('Nenhuma linha válida encontrada.')

  const output = serializeDelimited(rows, target)
  const meta = `${rows.length} linha${rows.length === 1 ? '' : 's'} · ${rows[0]?.length ?? 0} coluna${rows[0]?.length === 1 ? '' : 's'} · ${CSV_DELIMITER_LABELS[detected]} → ${CSV_DELIMITER_LABELS[target]}`

  return { output, meta, detected }
}

export { DataToolError }
