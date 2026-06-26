import { DataToolError, type DataToolResult } from './dataError'
import { detectDelimiter, delimitedToObjects, parseDelimited } from './csv'

function escapeSql(value: string): string {
  return value.replace(/'/g, "''")
}

export function generateSqlInsert(
  input: string,
  tableName: string,
  format: 'csv' | 'json',
): DataToolResult {
  const table = tableName.trim() || 'minha_tabela'
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole CSV ou JSON para gerar INSERTs.')

  let rows: Record<string, string>[]

  if (format === 'json') {
    let parsed: unknown
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      throw new DataToolError('JSON inválido.')
    }

    if (!Array.isArray(parsed)) throw new DataToolError('JSON precisa ser um array de objetos.')
    rows = parsed.map((item, index) => {
      if (item === null || typeof item !== 'object' || Array.isArray(item)) {
        throw new DataToolError(`Item ${index + 1} não é um objeto.`)
      }
      const record: Record<string, string> = {}
      Object.entries(item as Record<string, unknown>).forEach(([key, value]) => {
        record[key] =
          value === null || value === undefined
            ? ''
            : typeof value === 'object'
              ? JSON.stringify(value)
              : String(value)
      })
      return record
    })
  } else {
    const delimiter = detectDelimiter(trimmed)
    rows = delimitedToObjects(parseDelimited(trimmed, delimiter))
  }

  if (rows.length === 0) throw new DataToolError('Nenhum registro encontrado.')

  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key))
      return set
    }, new Set<string>()),
  )

  const statements = rows.map((row) => {
    const values = columns
      .map((column) => {
        const value = row[column] ?? ''
        return value === '' ? 'NULL' : `'${escapeSql(value)}'`
      })
      .join(', ')
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values});`
  })

  return {
    output: statements.join('\n'),
    meta: `${statements.length} INSERT${statements.length === 1 ? '' : 's'}`,
  }
}

export const sqlInsertSample = `nome,cargo
Ana Costa,Analista
Lucas Mendes,Engenheiro`
