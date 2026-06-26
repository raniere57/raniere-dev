export type JsonCsvDirection = 'json-to-csv' | 'csv-to-json'

export interface ConvertResult {
  output: string
  meta?: string
}

export class ConvertError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConvertError'
  }
}

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''

  const text =
    typeof value === 'object' ? JSON.stringify(value) : String(value)

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function parseCsvLine(line: string): string[] {
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

    if (char === ',' && !inQuotes) {
      cells.push(current)
      current = ''
      continue
    }

    current += char
  }

  cells.push(current)
  return cells
}

function parseCsv(text: string): string[][] {
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
      if (row.trim() !== '') rows.push(parseCsvLine(row))
      row = ''
      continue
    }

    row += char
  }

  if (row.trim() !== '') rows.push(parseCsvLine(row))
  return rows
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

export function jsonToCsv(input: string): ConvertResult {
  const trimmed = input.trim()
  if (!trimmed) throw new ConvertError('Cole um JSON para converter.')

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new ConvertError('JSON inválido. Verifique vírgulas, aspas e colchetes.')
  }

  const rows = normalizeJsonRows(parsed)
  if (rows.length === 0) {
    return { output: '', meta: '0 linhas' }
  }

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key))
      return set
    }, new Set<string>()),
  )

  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(',')),
  ]

  return {
    output: lines.join('\n'),
    meta: `${rows.length} linha${rows.length === 1 ? '' : 's'} · ${headers.length} coluna${headers.length === 1 ? '' : 's'}`,
  }
}

export function csvToJson(input: string): ConvertResult {
  const rows = parseCsv(input)
  if (rows.length === 0) throw new ConvertError('Cole um CSV para converter.')

  const [headerRow, ...dataRows] = rows
  const headers = headerRow.map((header, index) => header.trim() || `col_${index + 1}`)

  if (headers.length === 0) throw new ConvertError('Cabeçalho CSV não encontrado.')

  const objects = dataRows.map((cells) => {
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? ''
    })
    return record
  })

  return {
    output: JSON.stringify(objects, null, 2),
    meta: `${objects.length} registro${objects.length === 1 ? '' : 's'} · ${headers.length} campo${headers.length === 1 ? '' : 's'}`,
  }
}

export function convertJsonCsv(direction: JsonCsvDirection, input: string): ConvertResult {
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
