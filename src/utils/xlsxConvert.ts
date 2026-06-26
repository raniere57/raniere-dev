import * as XLSX from 'xlsx'
import { DataToolError, type DataToolResult } from './dataError'
import {
  delimitedToObjects,
  detectDelimiter,
  parseDelimited,
  serializeDelimited,
} from './csv'
import { jsonToCsv } from './jsonCsv'

export interface XlsxSheetInfo {
  name: string
  rows: number
}

export function listXlsxSheets(data: ArrayBuffer): XlsxSheetInfo[] {
  const workbook = XLSX.read(data, { type: 'array' })
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name]
    const ref = sheet['!ref']
    const range = ref ? XLSX.utils.decode_range(ref) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }
    const rows = Math.max(range.e.r - range.s.r, 0)
    return { name, rows }
  })
}

export function convertXlsxSheet(
  data: ArrayBuffer,
  sheetName: string,
  direction: 'xlsx-to-csv' | 'xlsx-to-json',
): DataToolResult {
  const workbook = XLSX.read(data, { type: 'array' })
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) throw new DataToolError(`Aba "${sheetName}" não encontrada.`)

  const matrix = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][]

  if (matrix.length === 0) throw new DataToolError('A aba selecionada está vazia.')

  const normalized = matrix.map((row) => row.map((cell) => String(cell ?? '')))

  if (direction === 'xlsx-to-csv') {
    return {
      output: serializeDelimited(normalized, ','),
      meta: `${Math.max(normalized.length - 1, 0)} linhas · aba ${sheetName}`,
    }
  }

  const objects = delimitedToObjects(normalized)
  return {
    output: JSON.stringify(objects, null, 2),
    meta: `${objects.length} registro${objects.length === 1 ? '' : 's'} · aba ${sheetName}`,
  }
}

export function textToXlsx(input: string, direction: 'csv-to-xlsx' | 'json-to-xlsx'): ArrayBuffer {
  let rows: string[][]

  if (direction === 'json-to-xlsx') {
    const csv = jsonToCsv(input).output
    const delimiter = detectDelimiter(csv)
    rows = parseDelimited(csv, delimiter)
  } else {
    const delimiter = detectDelimiter(input)
    rows = parseDelimited(input, delimiter)
  }

  if (rows.length === 0) throw new DataToolError('Nenhuma linha para exportar.')

  const sheet = XLSX.utils.aoa_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Dados')
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer
}
